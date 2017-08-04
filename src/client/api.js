const URL = require('url');
const helper = require('../util/helpers');
const crypto = require('crypto');
const snekfetch = require('snekfetch');

exports.API = class {
    constructor(client) {
        this.client = client;
    }
    
    async request(method, url) {
        return new Promise((resolve, reject) => {
            const parsedUrl = URL.parse(url, false);
            let options = {
                oauth_consumer_key: this.client.credentials.consumer_key,
                oauth_nonce: helper.genNonce(32),
                oauth_signature_method: 'HMAC-SHA1',
                oauth_timestamp: Math.floor( (new Date()).getTime() / 1000 ).toString(),
                oauth_token: this.client.credentials.access_token,
                oauth_version: '1.0A'
            };
            options = helper.sortObject(options);
            const paramval = helper.fixedEncodeURIComponent(helper.stringfiller('param', options));
            const url = helper.fixedEncodeURIComponent(url);
            const basesign = `${method.toUpperCase()}&${url}&${paramval}`;
            const signkey = `${helper.fixedEncodeURIComponent(this.client.credentials.consumer_secret)}&${helper.fixedEncodeURIComponent(this.client.credentials.access_token_secret)}`;
            options.oauth_signature = crypto.createHmac('sha1', signkey).update(basesign).digest('base64');
            const headerval = helper.stringfiller('oauthheader', options);
            const resp = await snekfetch.get('https://api.twitter.com/1.1/account/verify_credentials.json')
                .set('Accept', '*/*')
                .set(`Authorization`, headerval)
                .set('Connection', 'close')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Host', parsedUrl.host)
                .set('Content-length', 0)
                .catch(e => reject(e));
            resolve(resp);
        });
    }
};