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

import express from "express";
const route = express.Router();

/*
|-------------------------------------------------------------------------------
| Web Routes For Server-Side Rendering (SSR)
|-------------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// ! +--------------------------------------------------------------------------+
// ! | Cross-site request forgery (CSRF) Global middleware for web SSR          |
// ! +--------------------------------------------------------------------------+
import * as middleware from "../app/middleware/_index.js";
import cookieConfig from "../functions/Cookie.js";

route.use(middleware.csrf, (request, response, next) => {
    response.cookie("from", request.url, cookieConfig);
    response.cookie("nodeserver_key", request.csrfToken(), cookieConfig);
    next();
});

// ! +--------------------------------------------------------------------------+
// ! | Controller and routes for web SSR                                        |
// ! +--------------------------------------------------------------------------+
import * as controller from "../app/controllers/http/_index.js";

route.get("/", [middleware.auth.check], controller.web.sign_in);
route.get("/sign_up", [middleware.auth.check], controller.web.sign_up);
route.get("/cpanel", [middleware.auth.verify], controller.web.cpanel);

// ! +--------------------------------------------------------------------------+
// ! | Error handler                                                            |
// ! +--------------------------------------------------------------------------+
route.get("/handler", [middleware.error.check], controller.web.handler);

export default route;
