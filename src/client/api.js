exports.API = class {
    constructor(client) {
        this.client = client;
    }
    
    async request(method, url, options = {}) {
        method = method.toUpperCase();
        const config = this.client.credentials;
        const signkey = `${encodeURIComponent(config.consumer_secret)}&${encodeURIComponent(config.access_token_secret)}`;
        const paramstring = `${options.s}`
        const basestring = `${method}&${url}&`
        
        
    }
}