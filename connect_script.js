var connect_script = {
    "type": "script",
    "exportAs": "connect",
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