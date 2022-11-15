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

import fs from "fs";
import PATH from "path";

export default class Base64 {
    /**
     *  !-- Convert file (Function)
     *  file to base64
     *
     * @return base64
     */
    static encode(path, format) {
        //
        const baseURL = PATH.join("public/");
        const string = fs.readFileSync(baseURL + path, "base64");
        const formatImg = "data:image/gif;base64,";
        const formatSvg = "data:image/svg+xml;base64,";

        let base64;
        switch (format) {
            //
            case "svg":
                base64 = formatSvg + string;
                break;
            default:
                base64 = formatImg + string;
                break;
        }

        return base64;
    }
}
