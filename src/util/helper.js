exports.randomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

exports.fixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
}

exports.sortObject = (OrigObject) => {
    let a = [ ];
    let o = new Map();
    let sorted = { };
    
    const keys = Object.keys(OrigObject);
    for(const key of keys) {
        a.push(key);
        o.set(key, OrigObject[key]);
    }
    
    a.sort();
    for(const val of a) {
        sorted[val] = o.get(val);
    }
    
    return sorted;
}

exports.stringfiller = (method, options) => {
    if(method === 'param') {
        let string = '';
        Object.entries(options).forEach(([key, value]) => {
            string += `${exports.fixedEncodeURIComponent(key)}=${exports.fixedEncodeURIComponent(value)}&`
        });
        return string.slice(0, -1);
    } else if(method === 'oauthheader') {
        let string = 'Oauth ';
        Object.entries(options).forEach(([key, value]) => {
            string += `${exports.fixedEncodeURIComponent(key)}="${exports.fixedEncodeURIComponent(value)}", `
        });
        return string.slice(0, -2);
    }
}
