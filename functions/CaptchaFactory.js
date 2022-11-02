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
import svg2img from "svg2img";
import btoa from "btoa";
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
        const svg = captcha.data;
        const text = CryptoJS.SHA256(captcha.text).toString();

        const base64Svg = "data:image/svg+xml;base64," + btoa(svg);
        const base64Img = "data:image/gif;base64,";

        let base64 = "";
        svg2img(base64Svg, (error, buffer) => {
            return (base64 = base64Img + buffer.toString("base64"));
        });

        return { svg, base64, text, config };
    }
}
