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

import TokenFactory from "../functions/TokenFactory.js";

// ! +--------------------------------------------------------------------------+
// ! | Controller and routes                                                    |
// ! +--------------------------------------------------------------------------+
import ApiController from "../app/controllers/http/ApiController.js";

route.get("/session", TokenFactory.refresh);

route.get("/users", [TokenFactory.verify], ApiController.GET);
route.post("/users", ApiController.POST);
route.delete("/users", ApiController.DELETE);

export default route;
