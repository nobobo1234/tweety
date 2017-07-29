//const url = require('url');
//const snekfetch = require('snekfetch');
const { secureRandom } = require('secure-random');

class Client {
    constructor(credentials = {}) {
        super();
        if(!(this instanceof Client)) {
            return new Twitter(config);
        }
        
        this.validateConfig(credentials);
        Object.defineProperty(this, credentials, {writable: false})
        this.API = new API()
    }
    
    login() {
        const consumerKey = this.credentials.consumer_key;
        const nonce = secureRandom(32);
        console.log(nonce);
//        snekfetch.get('https://api.twitter.com/1.1/account/verify_credentials.json')
//        .set('')
    }
    
    validateConfig(config) {
        if(typeof config !== 'object') {
            throw new TypeError(`The credentials must be an object, now its an ${typeof config}`);
        }
        
        const auth_type;
        const requiredkeys;
        
        const required_for_app_auth = [
          'consumer_key',
          'consumer_secret'
        ];

        const required_for_user_auth = required_for_app_auth.concat([
          'access_token',
          'access_token_secret'
        ]);
        
        if(config.app_only_auth) {
            auth_type = 'app-only auth';
            required_keys = required_for_app_auth;
        } else {
            const auth_type = 'user auth';
            const required_keys = required_for_user_auth;
        }
        
        required_keys.forEach((key) => {
            if(!config[key]) {
                const errmsg = `The credentials must include ${req_key} when using ${auth_type}`;
                throw new Error(errmsg);
            }
        });
    }
};

const client = new Client({
    consumer_key: 'riemorjoieirofjerf',
    consumer_secret: 'refwefwefwef',
    access_token: 'efwfwefwefwef',
    access_token_secret: 'ewfewfregregre'
})

client.login();