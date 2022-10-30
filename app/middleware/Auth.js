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

import security from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class Auth {
    /**
     *  !-- VERIFY (Middleware)
     *  verify token before enter
     *
     * @return redirect
     */
    static verify(request, response, next) {
        const valid = request.cookies.session;
        const accessKey = process.env.SESSION_KEY;

        if (!valid) {
            return response.redirect("/");
        } else {
            security.verify(valid, accessKey, (error, auth) => {
                if (error) {
                    return response.clearCookie("session").redirect("/");
                } else {
                    request.body.auth = auth;
                    next();
                }
            });
        }
    }
    /**
     *  !-- CHECK (Middleware)
     *  check token before enter
     *
     * @return redirect
     */
    static check(request, response, next) {
        const valid = request.cookies.session;
        const accessKey = process.env.SESSION_KEY;

        if (valid) {
            security.verify(valid, accessKey, (error, auth) => {
                if (error) {
                    return response.clearCookie("session").redirect("/");
                } else {
                    response.redirect("/cpanel");
                }
            });
        } else {
            next();
        }
    }
}
