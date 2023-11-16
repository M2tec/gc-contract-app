let lock_script = {
    "type": "script",
    "title": "Forty Two (typed)",
    "description": "This contract will lock up some tokens that can only be unlocked providing 42 as typed redeemer and datum.. A GameChanger Wallet Dapp Demo. https://gamechanger.finance/",
    "exportAs": "FortyTwoTypedDemo",
    "return": {
        "mode": "last"
    },
    "run": {
        "dependencies": {
            "type": "script",
            "run": {
                "datum": {
                    "type": "plutusData",
                    "data": {
                        "fromJSON": {
                            "schema": 1,
                            "obj": {
                                "constructor": 0,
                                "fields": [
                                    {
                                        "int": 42
                                    }
                                ]
                            }
                        }
                    }
                },
                "lock": {
                    "type": "data",
                    "value": [
                        {
                            "policyId": "ada",
                            "assetName": "ada",
                            "quantity": "5000000"
                        }
                    ]
                },
                "stakeCredential": {
                    "type": "data",
                    "value": "ad03a4ae45b21f50fde67956365cff94db41bc08a2c2862403d8a234"
                },
                "contract": {
                    "type": "plutusScript",
                    "script": {
                        "scriptHex": "5907e15907de010000323322323232323232323232323232323322323232323223223223232533532323232325335002100110213332001501f00348150ccc8005407800d20543333573466e1cd55cea80224000466442466002006004646464646464646464646464646666ae68cdc39aab9d500c480008cccccccccccc88888888888848cccccccccccc00403403002c02802402001c01801401000c008cd4064068d5d0a80619a80c80d1aba1500b33501901b35742a014666aa03aeb94070d5d0a804999aa80ebae501c35742a01066a0320486ae85401cccd54074095d69aba150063232323333573466e1cd55cea801240004664424660020060046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40bdd69aba150023030357426ae8940088c98c80c8cd5ce01981901809aab9e5001137540026ae854008c8c8c8cccd5cd19b8735573aa004900011991091980080180119a817bad35742a00460606ae84d5d1280111931901919ab9c033032030135573ca00226ea8004d5d09aba2500223263202e33573805e05c05826aae7940044dd50009aba1500533501975c6ae854010ccd540740848004d5d0a801999aa80ebae200135742a00460466ae84d5d1280111931901519ab9c02b02a028135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d55cf280089baa00135742a00860266ae84d5d1280211931900e19ab9c01d01c01a3333573466e1cd55cea802a400046eb4d5d09aab9e500623263201b3357380380360326666ae68cdc39aab9d5006480008dd69aba135573ca00e464c6403466ae7006c06806040644c98c8064cd5ce2490350543500019135573ca00226ea80044dd500089baa0011232230023758002640026aa02e446666aae7c004940288cd4024c010d5d080118019aba2002014232323333573466e1cd55cea8012400046644246600200600460186ae854008c014d5d09aba2500223263201433573802a02802426aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea80124000466442466002006004602a6ae854008cd403c050d5d09aba2500223263201933573803403202e26aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931900d99ab9c01c01b019018017135573aa00226ea8004d5d0a80119a805bae357426ae8940088c98c8054cd5ce00b00a80989aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d5405088c8cccd55cf80112804119a8039991091980080180118031aab9d5002300535573ca00460086ae8800c0484d5d080088910010910911980080200189119191999ab9a3370ea0029000119091180100198029aba135573ca00646666ae68cdc3a801240044244002464c6402066ae700440400380344d55cea80089baa001232323333573466e1d400520062321222230040053007357426aae79400c8cccd5cd19b875002480108c848888c008014c024d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6402066ae7004404003803403002c4d55cea80089baa001232323333573466e1cd55cea80124000466442466002006004600a6ae854008dd69aba135744a004464c6401866ae700340300284d55cf280089baa0012323333573466e1cd55cea800a400046eb8d5d09aab9e500223263200a33573801601401026ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263201333573802802602202001e01c01a01801626aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931900619ab9c00d00c00a009135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c8024cd5ce00500480380309aab9d50011375400224464646666ae68cdc3a800a40084244400246666ae68cdc3a8012400446424446006008600c6ae84d55cf280211999ab9a3370ea00690001091100111931900519ab9c00b00a008007006135573aa00226ea80048c8cccd5cd19b8750014800880248cccd5cd19b8750024800080248c98c8018cd5ce00380300200189aab9d37540029309000a4810350543100122333573466e1c00800401000c488008488004448c8c00400488cc00cc008008005",
                        "lang": "plutus_v2"
                    }
                },
                "address": {
                    "type": "buildAddress",
                    "name": "ContractAddress",
                    "addr": {
                        "spendScriptHashHex": "{get('cache.dependencies.contract.scriptHashHex')}",
                        "stakePubKeyHashHex": "{get('cache.dependencies.stakeCredential')}"
                    }
                }
            }
        },
        "buildLock": {
            "type": "buildTx",
            "name": "built-lock",
            "tx": {
                "outputs": [
                    {
                        "address": "{get('cache.dependencies.address')}",
                        "datum": {
                            "datumHashHex": "{get('cache.dependencies.datum.dataHashHex')}"
                        },
                        "assets": "{get('cache.dependencies.lock')}"
                    }
                ],
                "options": {
                    "changeOptimizer": "NO"
                }
            }
        },
        "signLock": {
            "type": "signTxs",
            "namePattern": "signed-lock",
            "detailedPermissions": false,
            "txs": [
                "{get('cache.buildLock.txHex')}"
            ]
        },
        "submitLock": {
            "type": "submitTxs",
            "namePattern": "submitted-lock",
            "txs": "{get('cache.signLock')}"
        },
        "finally": {
            "type": "script",
            "run": {
                "lock": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.lock')}"
                },
                "smartContract": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.contract.scriptHex')}"
                },
                "smartContractHash": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.contract.scriptHashHex')}"
                },
                "smartContractAddress": {
                    "type": "macro",
                    "run": "{get('cache.dependencies.address')}"
                },
                "lockTx": {
                    "type": "macro",
                    "run": "{get('cache.buildLock.txHash')}"
                }
            }
        }
    }
}