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

import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

export default class Captcha {
    /**
     *  !-- VERIFY (Middleware)
     *  validate captcha
     *
     * @return redirect url or next
     */
    static verify(request, response, next) {
        const plain = CryptoJS.SHA256(request.body.captcha_plain).toString();
        const cipher = request.cookies.captcha;
        const match = plain === cipher;
        const previous = request.cookies.from;

        if (!match) {
            request.flash("invalid_captcha", "Invalid captcha.");
            return response.status(301).redirect(previous);
        } else {
            return next();
        }
    }
}
