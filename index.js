async function store() {
    const sCA = document.getElementById("contractInput").value
    const lockTxHash = document.getElementById("txHashInput").value
    const lockTxIndex = document.getElementById("txHashIndexInput").value   
    localStorage.setItem("smartContractAddress", sCA);
    localStorage.setItem("lockTx", lockTxHash);
    localStorage.setItem("lockTxIndex", lockTxIndex);
    main()
}

async function main() {


    function toHex(str) {
        var result = '';
        for (var i=0; i<str.length; i++) {
          result += str.charCodeAt(i).toString(16);
        }
        return result;
      }

    
    
    // import {gc,encodings} from '@gamechanger-finance/gc'
    const {gc,encodings}=window;
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

    // const blockfrostInput = document.getElementById("blockfrostInput")
    const contractInput = document.getElementById("contractInput")
    const txHashInput = document.getElementById("txHashInput")
    const txHashIndexInput = document.getElementById("txHashIndexInput")

    const connectButton = document.getElementById("connectButton")
 
    async function updateUI() {
        error = "";
        actionUrl_lock = "";

        actionUrl_unlock = "";

        console.log(contractInput.value);
        console.log(typeof(contractInput.value));

        

        if(contractInput.value !== "undefined"){
            console.log("get")
            contractInput.value = localStorage.getItem("smartContractAddress");
        }
        
        contractInput.value = localStorage.getItem("smartContractAddress");
        


        if(txHashInput.value !== "undefined"){
            console.log("get")
            txHashInput.value = localStorage.getItem("lockTx");
        } else {
            txHashInput.value = localStorage.getItem("lockTx");
        }

        txHashIndexInput.value = parseInt(localStorage.getItem("lockTxIndex"));


        // GameChanger Wallet support arbitrary data returning from script execution, encoded in a redirect URL
        // Head to http:// localhost:3000/doc/api/v2/api.html#returnURLPattern to learn ways how to customize this URL

        // lets try to capture the execution results by decoding/decompressing the return URL
        try {
            const resultRaw = (new URL(currentUrl)).searchParams.get("result");
            if (resultRaw) {
                resultObj     = await encodings.msg.decoder(resultRaw);
                //avoids current url carrying latest results all the time 
                history.pushState({}, '', window.location.pathname);
            }
        } catch (err) {
            error += `Failed to decode results.${err?.message || "unknown error"}`;
            console.error(err);
        }

        // Token lock button
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
                localStorage.setItem("smartContractAddress", sCA);
                contractInput.value = sCA;
                
                const lockTxHash = resultObj.exports.Lock_Demo.lockTx;
                const lockTxIndex = resultObj.exports.Lock_Demo.lockUTXO;
                console.log({lockTxHash,lockTxIndex});
                // localStorage.setItem("lockTxExports", lockTxExports);
                localStorage.setItem("lockTx", lockTxHash);
                localStorage.setItem("lockTxIndex", lockTxIndex);

                txHashInput.value = localStorage.getItem("lockTx");;
                txHashIndexInput.value = parseInt(localStorage.getItem("lockTxIndex"));
                contractInput.value = localStorage.getItem("smartContractAddress");
            }

        }
    }

    async function buildActionUrl_lock(args) {
        lockNumber = parseInt(lockInput.value);
        lock_script.run.dependencies.run.datum.data.fromJSON.obj.int = lockNumber;
        lock_script.returnURLPattern = window.location.origin + window.location.pathname;
        const scHex=await generateSC(lockNumber);
        lock_script.run.dependencies.run.contract.script={
            "heliosCode": `{hexToStr('${scHex}')}`,
            "version": "latest"
        }
        const url=await gc.encode.url({
            input:JSON.stringify(lock_script),
            apiVersion:"2",
            network:"preprod",
            //encoding:"gzip",
          });
        return url;
    }

    async function buildActionUrl_unlock(args) {
        contractInput.value = localStorage.getItem("smartContractAddress");
        unlock_script.run.buildUnlock.tx.inputs[0].txHash = localStorage.getItem("lockTx");
        unlock_script.run.buildUnlock.tx.inputs[0].index = parseInt(localStorage.getItem("lockTxIndex"));

        unlockNumber = parseInt(unlockInput.value);      
        unlock_script.run.dependencies.run.redeemer.data.fromJSON.obj.int = unlockNumber;

        const scHex=await generateSC(unlockNumber);
        unlock_script.run.dependencies.run.contract.script={
            "heliosCode": `{hexToStr('${scHex}')}`,
            "version": "latest"
        }

        unlock_script.returnURLPattern = window.location.origin + window.location.pathname;
        const url=await gc.encode.url({
            input:JSON.stringify(unlock_script),
            apiVersion:"2",
            network:"preprod",
            //encoding:"gzip",
          });
        return url;
    }

    async function buildActionUrl_connect(args) {
        connect_script.returnURLPattern = window.location.origin + window.location.pathname;
        const url=await gc.encode.url({
            input:JSON.stringify(connect_script),
            apiVersion:"2",
            network:"preprod",
            //encoding:"gzip",
          });;
        return url;
    }

    updateUI();
}

window.onload = function () {
    main();
}
