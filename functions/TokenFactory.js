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

"use strict";

import dotenv from "dotenv";
import security from "jsonwebtoken";

dotenv.config();

export default class TokenFactory {
    /**
     *  !-- CREATE
     *  create new access_token and session_token
     *
     * @return new access_token and session_token
     */
    static create(credentials) {
        const accessKey = process.env.ACCESS_KEY;
        const sessionKey = process.env.SESSION_KEY;

        const newToken = {
            access: security.sign(credentials, accessKey, {
                expiresIn: "1d",
            }),
            session: security.sign(credentials, sessionKey, {
                expiresIn: "1d",
            }),
        };

        return newToken;
    }
}
