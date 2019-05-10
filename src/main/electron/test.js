const builder = require("electron-builder");
const { url, appId, productName } = require('./config');
const Platform = builder.Platform;

builder.build({
    targets: Platform.WINDOWS.createTarget(),
    config: {
        "directories": {
            "output": "build"
        },
        "copyright": "Copyright © 2019 Gustavo Valle",
        "publish": [{
            "provider": "generic",
            "url": url
        }],
        "asar": false,
        "extraMetadata": {
            "name": appId
        },
        "win": {
            "publisherName": "CN=Contoso Software, O=Contoso Corporation, C=US",
            "verifyUpdateCodeSignature": true              
        }
    }
})
.then(() => {
    // handle result
    console.log('Build OK!');
})
.catch((error) => {
    // handle error
    console.log(error);
})
