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

import { body, check } from "express-validator";

const sign_up = [
    body("username").custom(async (value, { req }) => {
        //
        const duplicate = await UserFinder.find(value);
        if (duplicate) throw new Error("Try using another username.");
        return true;
    }),
    body("email")
        .custom(async (value, { req }) => {
            //
            const duplicate = await UserFinder.find(value);
            if (duplicate) throw new Error("Try using another email.");

            return true;
        })
        .isEmail()
        .withMessage("Email is invalid."),
    check("signup_password", "Password is too weak.").isLength({ min: 8 }),
    body("confirm_password").custom(async (value, { req }) => {
        //
        if (value !== req.body.signup_password)
            throw new Error("Password not match.");

        return true;
    }),
];

export { sign_up };
