///////////////////////////
//// Encoding Helpers /////
///////////////////////////

//https://github.com/blakeembrey/universal-base64/blob/master/src/browser.ts
function base64Encode(str) {
    const percentToByte = (p) => String.fromCharCode(parseInt(p.slice(1), 16));
    return btoa(encodeURIComponent(str).replace(/%[0-9A-F]{2}/g, percentToByte));
}

function base64Decode(str) {
    const byteToPercent = (b) => `%${`00${b.charCodeAt(0).toString(16)}`.slice(-2)}`;
    return decodeURIComponent(Array.from(atob(str), byteToPercent).join(""));
}

//https://github.com/blakeembrey/universal-base64url/blob/master/src/index.ts
function base64urlDecode(str) {
    return base64Decode(str.replace(/\-/g, "+").replace(/_/g, "/"));
}

function base64urlEncode(str) {
    return base64Encode(str)
        .replace(/\//g, "_")
        .replace(/\+/g, "-")
        .replace(/=+$/, "");
}

async function base64ToBytes(base64) {
    const res = await fetch("data:application/octet-stream;base64," + base64);
    return new Uint8Array(await res.arrayBuffer());
}

function urlSafeBase64Encode(safeBase64) {
    return safeBase64
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        .replace(/=+$/, ''); // Remove ending '='
};

function urlSafeBase64Decode(safeBase64, padding = true) {
    // Add removed at end '='
    let unsafeBase64 = safeBase64
    if (padding)
        unsafeBase64 += Array(5 - unsafeBase64.length % 4).join('=');
    unsafeBase64 = unsafeBase64
        .replace(/\-/g, '+') // Convert '-' to '+'
        .replace(/\_/g, '/'); // Convert '_' to '/'
    //return new Buffer(unsafeBase64, 'base64');
    return unsafeBase64;
};

function compress(string, encoding) {
    const byteArray = new TextEncoder().encode(string);
    const cs = new CompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer();
}

function decompress(byteArray, encoding) {
    const cs = new DecompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
        return new TextDecoder().decode(arrayBuffer);
    });
}

async function encodeByteArray(array) {
    return new Promise((resolve) => {
        const blob = new Blob([array]);
        const reader = new FileReader();

        reader.onload = (event) => {
            const dataUrl = event.target.result;
            const [_, base64] = dataUrl.split(',');

            resolve(base64);
        };

        reader.readAsDataURL(blob);
    });
}

const codecs = {
    'gzip': {
        header: '1-',
        encoder: async function (code) {
            var header = '1-';
            // Compact JSON
            var json = JSON.stringify(code);
            // Compress JSON with gzip
            var encoded_data = await compress(json, "gzip")
            // Base64url encode data
            var buffer = await encodeByteArray(encoded_data);
            var base64String = urlSafeBase64Encode(buffer.toString())
            var msg = `${header}${base64String}`;
            return msg;
        },
        decoder: async function (msg) {
            var header = '1-';
            var base64url = msg.replace(header, '');
            // base64ToBytes() requires base64 without padding, so we pass padding=false
            var base64 = urlSafeBase64Decode(base64url, false);
            var encoded_data = await base64ToBytes(base64)
            var json = await decompress(encoded_data, "gzip");
            var obj = JSON.parse(json);
            return obj;
        },
    }
}

function gcEncoder(obj, codec = 'gzip') {
    return codecs[codec].encoder(obj);
}
function gcDecoder(msg, codec) {
    let _useCodec = codec;
    if (!_useCodec)
        Object.keys(codecs).forEach(_codec => {
            const header = codecs[_codec].header;
            if (msg.startsWith(header))
                _useCodec = _codec;
        });
    return codecs[_useCodec].decoder(msg);
}