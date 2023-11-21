async function main() {
    // Dapp <--> GameChanger Wallet connections can use URL redirections
    let actionUrl = "";
    let resultObj = undefined;
    let error = "";


    // GameChanger Wallet is pure Web3, zero backend procesing of user data. 
    // Dapp connector links are fully processed on end-user browsers.
    const gcApiUrl = "https://beta-preprod-wallet.gamechanger.finance/api/2/run/";
    const currentUrl = window.location.href;

    // UI components:
    const connectForm = document.getElementById("dappConnectorBox");
    const errorsBox = document.getElementById("errorBox");
    const resultsBox = document.getElementById("resultBox");

    const lockButton = document.getElementById("lockBtn");
    const unlockButton = document.getElementById("unlockBtn");

    const lockInput = document.getElementById("lockInput")
    const unlockInput = document.getElementById("unlockInput")

    const blockfrostInput = document.getElementById("blockfrostInput")
    const contractInput = document.getElementById("contractInput")
    const txHashInput = document.getElementById("txHashInput")
    const txHashIndexInput = document.getElementById("txHashIndexInput")

    const connectButton = document.getElementById("connectButton")
    
    async function updateUI() {
        error = "";
        actionUrl_lock = "";

        actionUrl_unlock = "";


        if(localStorage.getItem("blockfrostApiKey")){
            blockfrostInput.value = localStorage.getItem("blockfrostApiKey")
        }

        if(blockfrostInput.value){
            localStorage.setItem("blockfrostApiKey", blockfrostInput.value );
        }


        // GameChanger Wallet support arbitrary data returning from script execution, encoded in a redirect URL
        // Head to http:// localhost:3000/doc/api/v2/api.html#returnURLPattern to learn ways how to customize this URL

        // lets try to capture the execution results by decoding/decompressing the return URL
        try {
            const resultRaw = (new URL(currentUrl)).searchParams.get("result");
            if (resultRaw) {
                resultObj = await gcDecoder(resultRaw);
                // avoids current url carrying latest results all the time 
                history.pushState({}, '', window.location.pathname);
            }
        } catch (err) {
            error += `Failed to decode results.${err?.message || "unknown error"}`;
            console.error(err);
        }

        // Token lock button
        // This is the GCScript code, packed into a URL, that GameChanger Wallet will execute
        // lets try to generate this connection URL by encoding/compressing the gcscript code
        try {
            // GCScript (dapp connector code) will be packed inside this URL    
            actionUrl_lock = await buildActionUrl_lock();
        } catch (err) {
            error += `Failed to build URL.${err?.message || "unknown error"}`
            console.error(err);
        }

        //Now lets render the current application state
        if (error) {
            errorBox.innerHTML = "Error: " + error;
        }
        if (actionUrl_lock) {
            errorBox.innerHTML = "";
            lockAction = "location.href='" + actionUrl_lock + "'"
            lockButton.setAttribute("onclick", lockAction)
            lockButton.innerHTML = `<img style="height: 20px" src="lock.svg"></img> Lock`;
        } else {
            lockButton.innerHTML = "Loading...";
        }

        // Token unlock button
        // This is the GCScript code, packed into a URL, that GameChanger Wallet will execute
        // lets try to generate this connection URL by encoding/compressing the gcscript code
        try {
            // GCScript (dapp connector code) will be packed inside this URL    
            actionUrl_unlock = await buildActionUrl_unlock();
        } catch (err) {
            error += `Failed to build URL.${err?.message || "unknown error"}`
            console.error(err);
        }

        if (actionUrl_unlock) {
            errorBox.innerHTML = "";
            unlockAction = "location.href='" + actionUrl_unlock + "'"
            unlockButton.setAttribute("onclick", unlockAction)
            unlockButton.innerHTML = `<img style="height: 20px" src="unlock.svg"></img> Unlock`;
        } else {
            unlockButton.href = '#';
            unlockButton.innerHTML = "Loading...";
        }

        // Token connect button
        // This is the GCScript code, packed into a URL, that GameChanger Wallet will execute
        // lets try to generate this connection URL by encoding/compressing the gcscript code
        try {
            // GCScript (dapp connector code) will be packed inside this URL    
            actionUrl_connect = await buildActionUrl_connect();
        } catch (err) {
            error += `Failed to build URL.${err?.message || "unknown error"}`
            console.error(err);
        }

        if (actionUrl_connect) {
            errorBox.innerHTML = "";
            connectAction = "location.href='" + actionUrl_connect + "'"
            connectButton.setAttribute("onclick", connectAction)

            if (localStorage.getItem("wallet_name")) {
                connectButton.innerHTML = localStorage.getItem("wallet_name");
            } else {
                connectButton.innerHTML = `Connect`;
            }

        } else {
            connectButton.href = '#';
            connectButton.innerHTML = "Loading...";
        }


        if (resultObj) {
            resultsBox.innerHTML = JSON.stringify(resultObj, null, 2);


            if (resultObj.exports.connect) {
                console.log(resultObj.exports.connect.data.name)
                console.log(resultObj.exports.connect.data.address)

                localStorage.setItem("wallet_name", resultObj.exports.connect.data.name)
                localStorage.setItem("wallet_address", resultObj.exports.connect.data.address)
                connectButton.innerHTML = localStorage.getItem("wallet_name");
            }

            if (resultObj.exports.Lock_Demo) {
                sCA = resultObj.exports.Lock_Demo.smartContractAddress;
                console.log(sCA);
                localStorage.setItem("smartContractAddressExports", sCA);
                contractInput.value = sCA;
                
                lockTxExports = resultObj.exports.Lock_Demo.lockTx;
                console.log(lockTxExports);
                localStorage.setItem("lockTxExports", lockTxExports);
                txHashInput.value = lockTxExports;
            }

        }
    }

    async function buildActionUrl_lock(args) {
        // This is the GCScript code that GameChanger Wallet will execute
        // JSON code that will be encoded/compressed inside 'actionUrl'

        // This is a patch to adapt the return URL of the script to the origin that is hosting this html file.
        // so this way executed scripts data exports can be captured back on dapp side

        lockNumber = parseInt(lockInput.value);
        lock_script.run.dependencies.run.datum.data.fromJSON.obj.fields[0].int = lockNumber;
        
        lock_script.returnURLPattern = window.location.origin + window.location.pathname;
        const encoded = await gcEncoder(lock_script);
        return `${gcApiUrl}${encoded}`;
    }

    async function buildActionUrl_unlock(args) {
        // This is the GCScript code that GameChanger Wallet will execute
        // JSON code that will be encoded/compressed inside 'actionUrl'

        // This is a patch to adapt the return URL of the script to the origin that is hosting this html file.
        // so this way executed scripts data exports can be captured back on dapp side
        async function getLockedUtxo() {
            const response = await fetch('https://cardano-preprod.blockfrost.io/api/v0/addresses/' + contractInput.value + '/transactions?count=1&order=desc', {
                headers: {
                    'Accept': 'application/json',
                    'Project_id': blockfrostInput.value
                }
            });
            const txData = await response.json();
            console.log(txData);
            
            lockTx = txData[0].tx_hash;
            console.log(lockTx);
            localStorage.setItem("lockTx", lockTx);
            txHashInput.value = lockTx;

            lockTxIndex = txData[0].tx_index;
            console.log(lockTxIndex);
            localStorage.setItem("lockTxIndex", parseInt(lockTxIndex));
            txHashIndexInput.value = lockTxIndex;

          }
          
        getLockedUtxo()

        contractInput.value = localStorage.getItem("smartContractAddress");
        unlock_script.run.buildUnlock.tx.inputs[0].txHash = localStorage.getItem("lockTx");
        unlock_script.run.buildUnlock.tx.inputs[0].index = parseInt(localStorage.getItem("lockTxIndex"));

        unlockNumber = parseInt(unlockInput.value);      
        unlock_script.run.dependencies.run.redeemer.data.fromJSON.obj.fields[0].int = unlockNumber;


        unlock_script.returnURLPattern = window.location.origin + window.location.pathname;
        const encoded = await gcEncoder(unlock_script);
        return `${gcApiUrl}${encoded}`;
    }

    async function buildActionUrl_connect(args) {
        // This is the GCScript code that GameChanger Wallet will execute
        // JSON code that will be encoded/compressed inside 'actionUrl'

        // This is a patch to adapt the return URL of the script to the origin that is hosting this html file.
        // so this way executed scripts data exports can be captured back on dapp side
        connect_script.returnURLPattern = window.location.origin + window.location.pathname;
        const encoded = await gcEncoder(connect_script);
        return `${gcApiUrl}${encoded}`;
    }



    updateUI();
}

window.onload = function () {
    main();
}
