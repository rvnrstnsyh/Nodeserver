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

import UserFinder from "../../../functions/UserFinder.js";

import argon2 from "argon2";

import { body } from "express-validator";

const sign_in = [
    body("identity").custom(async (value, { req }) => {
        //
        const exist = await UserFinder.find(value);
        if (!exist) throw new Error("Incorrect username or password.");
        return true;
    }),
    body("signin_password").custom(async (value, { req }) => {
        //
        const user = await UserFinder.find(req.body.identity);
        const match = await argon2.verify(user.password, value);
        if (!user || !match) throw new Error("Incorrect username or password.");

        return true;
    }),
];

export { sign_in };
