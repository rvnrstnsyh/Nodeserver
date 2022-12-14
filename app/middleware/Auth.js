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
import security from "jsonwebtoken";
import UserModel from "../models/User.js";

dotenv.config();

export default class Auth {
    /**
     *  !-- VERIFY (Middleware)
     *  verify token before enter
     *
     * @return redirect url or next
     */
    static verify(request, response, next) {
        const valid = request.cookies.session;
        const accessKey = process.env.SESSION_KEY;

        if (!valid) {
            return response.status(301).redirect("/");
        } else {
            security.verify(valid, accessKey, async (error, auth) => {
                if (error) {
                    // ? if valid and expired, delete matching session in database
                    const users = await UserModel.find();
                    users.forEach((user) => {
                        user.session.forEach(async (token) => {
                            if (token.value === valid) {
                                const newSession = user.session.filter(
                                    (data) => data.value !== valid
                                );
                                await UserModel.findOneAndUpdate(
                                    { email: user.email },
                                    { session: newSession }
                                );
                            }
                        });
                    });
                    return response.clearCookie("session").redirect("/");
                } else {
                    const user = await UserModel.findOne({ email: auth.email });
                    const deviceMatch = request.useragent.source === auth.agent;
                    let tokenExists = false;

                    user.session.forEach((token) => {
                        if (token.value === valid) tokenExists = true;
                    });

                    if (!tokenExists || !deviceMatch) {
                        return response
                            .status(301)
                            .clearCookie("session")
                            .redirect("/");
                    } else {
                        request.body.auth = auth;
                        return next();
                    }
                }
            });
        }
    }
    /**
     *  !-- CHECK (Middleware)
     *  check token before enter
     *
     * @return redirect url or next
     */
    static check(request, response, next) {
        const valid = request.cookies.session;
        const accessKey = process.env.SESSION_KEY;

        if (valid) {
            security.verify(valid, accessKey, async (error, auth) => {
                if (error) {
                    // ? if valid and expired, delete matching session in database
                    const users = await UserModel.find();
                    users.forEach((user) => {
                        user.session.forEach(async (token) => {
                            if (token.value === valid) {
                                const newSession = user.session.filter(
                                    (data) => data.value !== valid
                                );
                                await UserModel.findOneAndUpdate(
                                    { email: user.email },
                                    { session: newSession }
                                );
                            }
                        });
                    });
                    return response
                        .status(301)
                        .clearCookie("session")
                        .redirect("/");
                } else {
                    return response.status(301).redirect("/cpanel");
                }
            });
        } else {
            return next();
        }
    }
}
