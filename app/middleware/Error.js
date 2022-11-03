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

import dotenv from "dotenv";

dotenv.config();

export default class Error {
    /**
     *  !-- CHECK (Middleware)
     *  redirect to error handler page
     *
     * @return redirect
     */
    static check(request, response, next) {
        try {
            const message = request.flash("invalid");
            request.flash("invalid", message);
            return next();
        } catch (error) {
            return response.status(301).redirect("/");
        }
    }
}
