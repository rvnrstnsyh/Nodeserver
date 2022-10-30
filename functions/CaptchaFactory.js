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

import svgCaptcha from "svg-captcha";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

const ssl = process.env.NODE_SECURE.toLowerCase() === "true" ? true : false;

export default class CaptchaFactory {
    /**
     *  !-- CREATE
     *  create new captcha svg
     *
     * @return new captcha svg
     */
    static create() {
        svgCaptcha.options.width = 206;

        const captcha = svgCaptcha.create({ size: 7, noise: 3 });
        const config = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // ? 1 day
            secure: ssl,
        };
        const data = captcha.data;
        const text = CryptoJS.SHA256(captcha.text).toString();

        return { data, text, config };
    }
}
