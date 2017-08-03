const crypto = require('crypto');
const helper = require('../util/helper');
const snekfetch = require('snekfetch');
const { API } = require('./api');

class Client {
    constructor(credentials = {}) {
        if(!(this instanceof Client)) {

            return new Client(credentials);
        }
        
        this.validateConfig(credentials);
        Object.defineProperty(this, 'credentials', {writable: false, value: credentials});
        this.API = new API(this);
    }
    
    async login() {
        const timestamp = Math.floor(new Date().getTime() / 1000).toString();
        const signkey = `${helper.fixedEncodeURIComponent(this.credentials.consumer_secret)}&${helper.fixedEncodeURIComponent(this.credentials.access_token_secret)}`;
        let options = {
            include_entities: false,
            oauth_consumer_key: this.credentials.consumer_key,
            oauth_nonce: helper.randomString(32),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: timestamp,
            oauth_token: this.credentials.access_token,
            oauth_version: '1.0'
        };
        options = helper.sortObject(options);
        const paramval = helper.fixedEncodeURIComponent(helper.stringfiller('param', options)).replace(/%/g, (c) => '%' + c.charCodeAt(0).toString(16));
        const url = helper.fixedEncodeURIComponent('https://api.twitter.com/1.1/account/verify_credentials.json');
        const basesign = `GET&${url}&${paramval}`;
        console.log(basesign);
        options.oauth_signature = crypto.createHmac('sha1', signkey).update(basesign).digest('base64');
        options = helper.sortObject(options);
        const headerval = helper.stringfiller('oauthheader', options);
        // console.log(options.signature)
        // console.log(paramval);
        const resp = await snekfetch.get('https://api.twitter.com/1.1/account/verify_credentials.json')
            .set('Accept', '*/*')
            .set(`Authorization`, headerval)
            .set('Connection', 'close')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .catch(e => console.log(e));
    }
    
    validateConfig(config) {
        if(typeof config !== 'object') {
            throw new TypeError(`The credentials must be an object, now its an ${typeof config}`);
        }
        
        let authType;
        let requiredKeys;
        
        const required_for_app_auth = [
          'consumer_key',
          'consumer_secret'
        ];

        const required_for_user_auth = required_for_app_auth.concat([
          'access_token',
          'access_token_secret'
        ]);
        
        if(config.app_only_auth) {
            authType = 'app-only auth';
            requiredKeys = required_for_app_auth;
        } else {
            authType = 'user auth';
            requiredKeys = required_for_user_auth;
        }
        
        requiredKeys.forEach((key) => {
            if(!config[key]) {
                const errmsg = `The credentials must include ${key} when using ${authType}`;
                throw new Error(errmsg);
            }
        });
    }
}

const client = new Client({
    consumer_key: 'OwbTqMiRZ4CdnXVSYCtb0Iw0C',
    consumer_secret: 'ka3oaRmttoXws0iUpJc3fzFiAX0uCMpsUwC7Qaih8eBrc7e7z8',
    access_token: '1022269892-xCanMkBoleSlsRJ9YgIsv4MF4Gwt1nKpIbOMbbz',
    access_token_secret: 'vZ3edDHFnIyZwFlET30GsqKx9ec6upf4quxyzqElhNzJP'
});

client.login();