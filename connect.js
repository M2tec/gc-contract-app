var connect_script = {
    "type": "script",
    "exportAs": "connect",
    "returnURLPattern": "http://localhost:3000/demo/api/dapp",
    "run": {
      "data": {
        "type": "script",
        "run": {
          "name": {
            "type": "getName"
          },
          "address": {
            "type": "getCurrentAddress"
          },
        }
      },
      "hash": {
        "type": "macro",
        "run": "{sha512(objToJson(get('cache.data')))}"
      },
      "sign": {
        "type": "signDataWithAddress",
        "address": "{get('cache.data.address')}",
        "dataHex": "{get('cache.hash')}"
      }
    }
  }