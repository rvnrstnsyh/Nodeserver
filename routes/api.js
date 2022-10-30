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
| API Routes
|-------------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


// ! +--------------------------------------------------------------------------+
// ! | Cross-site request forgery (CSRF) middleware for web SSR                 |
// ! +--------------------------------------------------------------------------+
import * as middleware from "../app/middleware/_index.js"
import * as validator from "../app/validators/forms/_index.js";

// ! +--------------------------------------------------------------------------+
// ! | Controller and routes                                                    |
// ! +--------------------------------------------------------------------------+
// import ApiController from "../app/controllers/http/asdasd.js";
import * as controllers from "../app/controllers/http/_index.js"


route.post("/sign_in", [middleware.csrf, validator.sign_in], controllers.api.sign_in);
route.post("/sign_up", [middleware.csrf, validator.sign_up], controllers.api.sign_up);
route.post("/sign_out", controllers.api.sign_out);

export default route;
