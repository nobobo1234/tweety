exports.NONCE_CHARS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
              'o','p','q','r','s','t','u','v','w','x','y','z','A','B',
              'C','D','E','F','G','H','I','J','K','L','M','N','O','P',
              'Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3',
              '4','5','6','7','8','9'];

exports.genNonce = (nonceSize) => {
   var result = [];
   var chars= this.NONCE_CHARS;
   var char_pos;
   var nonce_chars_length= chars.length;

   for (var i = 0; i < nonceSize; i++) {
       char_pos= Math.floor(Math.random() * nonce_chars_length);
       result[i]=  chars[char_pos];
   }
   return result.join('');
};

exports.fixedEncodeURIComponent = (text) => {
    return encodeURIComponent(text).replace( /[\!\*\'\(\)]/g, (chr) => chr.charCodeAt(0).toString(16));
};

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
};

exports.stringfiller = (method, options) => {
    if(method === 'param') {
        let string = '';
        Object.entries(options).forEach(([key, value]) => {
            string += `${exports.fixedEncodeURIComponent(key)}=${exports.fixedEncodeURIComponent(value)}&`;
        });
        return string.slice(0, -1);
    } else if(method === 'oauthheader') {
        let string = 'Oauth ';
        Object.entries(options).forEach(([key, value]) => {
            if(key.startsWith('oauth_')) {
                string += `${exports.fixedEncodeURIComponent(key)}="${exports.fixedEncodeURIComponent(value)}",`;
            }
        });
        return string;
    }
};
