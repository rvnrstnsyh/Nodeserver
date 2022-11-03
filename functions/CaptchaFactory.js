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

import * as config from "../functions/Cookie.js";

import btoa from "btoa";
import svg2img from "svg2img";
import CryptoJS from "crypto-js";
import svgCaptcha from "svg-captcha";

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
