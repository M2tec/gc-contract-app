async function main() {
    // Dapp <--> GameChanger Wallet connections can use URL redirections
    let   actionUrl   = "";
    let   resultObj   = undefined;
    let   error       = ""; 


    // GameChanger Wallet is pure Web3, zero backend procesing of user data. 
    // Dapp connector links are fully processed on end-user browsers.
    const gcApiUrl    = "https:// beta-wallet.gamechanger.finance/api/2/run/";
    const currentUrl  = window.location.href;

    // UI components:
    const connectForm = document.getElementById("dappConnectorBox");
    const lockButton   = document.getElementById("lockBtn");
    const unlockButton   = document.getElementById("unlockBtn");    
    const errorsBox   = document.getElementById("errorBox");
    const resultsBox  = document.getElementById("resultBox");


    async function updateUI() {
        error="";
        actionUrl_lock="";

        actionUrl_unlock="";
        // GameChanger Wallet support arbitrary data returning from script execution, encoded in a redirect URL
        // Head to http:// localhost:3000/doc/api/v2/api.html#returnURLPattern to learn ways how to customize this URL

        // lets try to capture the execution results by decoding/decompressing the return URL
        try{                
            const resultRaw   = (new URL(currentUrl)).searchParams.get("result");
            if(resultRaw){
                resultObj     = await gcDecoder(resultRaw);
                // avoids current url carrying latest results all the time 
                history.pushState({}, '', window.location.pathname);
            }
        }catch(err){
            error+=`Failed to decode results.${err?.message||"unknown error"}`;
            console.error(err);
        }

        // Token lock button
        // This is the GCScript code, packed into a URL, that GameChanger Wallet will execute
        // lets try to generate this connection URL by encoding/compressing the gcscript code
        try{                
            // GCScript (dapp connector code) will be packed inside this URL    
            actionUrl_lock   = await buildActionUrl_lock(); 
        }catch(err){
            error+=`Failed to build URL.${err?.message||"unknown error"}`
            console.error(err);
        }
        
        //Now lets render the current application state
        if(error){
            errorBox.innerHTML="Error: " + error;
        }
        if(actionUrl_lock){
            errorBox.innerHTML="";
            lockButton.href=actionUrl_lock;
            lockButton.innerHTML = `<img style="height: 20px" src="lock.svg"></img> Lock`;
        }else{
            lockButton.href      = '#';
            lockButton.innerHTML = "Loading...";
        }

        // Token unlock button
        // This is the GCScript code, packed into a URL, that GameChanger Wallet will execute
        // lets try to generate this connection URL by encoding/compressing the gcscript code
        try{                
            // GCScript (dapp connector code) will be packed inside this URL    
            actionUrl_unlock   = await buildActionUrl_unlock(); 
        }catch(err){
            error+=`Failed to build URL.${err?.message||"unknown error"}`
            console.error(err);
        }

        if(actionUrl_unlock){
            errorBox.innerHTML="";
            unlockButton.href=actionUrl_unlock;
            unlockButton.innerHTML = `<img style="height: 20px" src="unlock.svg"></img> Unlock`;
        }else{
            unlockButton.href      = '#';
            unlockButton.innerHTML = "Loading...";
        }


        if(resultObj){
            resultsBox.innerHTML=JSON.stringify(resultObj,null,2);
        }             

    }

    async function buildActionUrl_lock(args){
        // This is the GCScript code that GameChanger Wallet will execute
        // JSON code that will be encoded/compressed inside 'actionUrl'

        // This is a patch to adapt the return URL of the script to the origin that is hosting this html file.
        // so this way executed scripts data exports can be captured back on dapp side
        lock_script.returnURLPattern  = window.location.origin +  window.location.pathname ;
        const encoded=await gcEncoder(lock_script);
        return `${gcApiUrl}${encoded}`;
    }

    async function buildActionUrl_unlock(args){
        // This is the GCScript code that GameChanger Wallet will execute
        // JSON code that will be encoded/compressed inside 'actionUrl'

        // This is a patch to adapt the return URL of the script to the origin that is hosting this html file.
        // so this way executed scripts data exports can be captured back on dapp side
        unlock_script.returnURLPattern  = window.location.origin +  window.location.pathname ;
        const encoded=await gcEncoder(unlock_script);
        return `${gcApiUrl}${encoded}`;
    }

    updateUI();
}

window.onload = function () {
    main();
}
