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
import csrfProtection from "../app/middleware/Csrf.js";

route.use(csrfProtection, (request, response, next) => {
    response.cookie("nodeserver_key", request.csrfToken());
    next();
});

// ! +--------------------------------------------------------------------------+
// ! | Controller and routes for web SSR                                        |
// ! +--------------------------------------------------------------------------+
import WebController from "../app/controllers/http/WebController.js";

route.get("/", WebController.index);

export default route;
