/*
|-------------------------------------------------------------------------------
| Nodeserver Copyright © 2021 rvnrstnsyh All Rights Reserved
|-------------------------------------------------------------------------------
|
| Author    : Rivane Rasetiansyah <re@rvnrstnsyh.dev> (https://rvnrstnsyh.dev)
| GitHub    : https://github.com/rvnrstnsyh
| GitLab    : https://gitlab.com/rvnrstnsyh
|
*/

import eccrypto from "eccrypto";
import elliptic from "elliptic";

class AccessKey {
    //
    constructor() {
        const ECDSA = elliptic.ec;
        const secp256k1 = new ECDSA("secp256k1");

        const newKey = {
            access_key: secp256k1
                .keyFromPrivate(eccrypto.generatePrivate())
                .getPrivate("hex"),
            session_key: secp256k1
                .keyFromPrivate(eccrypto.generatePrivate())
                .getPrivate("hex"),
        };

        console.log(newKey);
    }
}

new AccessKey();
