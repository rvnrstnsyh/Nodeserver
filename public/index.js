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

const baseURL = PATH.join("public/");

function read(path) {
    //
    return fs.readFileSync(baseURL + path, "utf8");
}

const items = {
    faviconIco: read("favicon.ico.txt"),
    cookiesSvg: read("assets/svg/noun-cookies-1342244.svg.txt"),
    ticketSvg: read("assets/svg/noun-ticket-809124.svg.txt"),
    forbiddenSvg: read("assets/svg/noun-forbidden-1433603.svg.txt"),
};

export default items;
