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
import UserModel from "../app/models/User.js";
import dotenv from "dotenv";

dotenv.config();

export default class TokenFactory {
    /**
     *  !-- CREATE
     *  create new access_token and session_token
     *
     * @return new access_token and session_token
     */
    static create(credentials) {
        const accessKey = process.env.ACCESS_KEY;
        const sessionKey = process.env.SESSION_KEY;

        const newToken = {
            access: security.sign(credentials, accessKey, {
                expiresIn: "10s",
            }),
            session: security.sign(credentials, sessionKey, {
                expiresIn: "1d",
            }),
        };

        return newToken;
    }
    /**
     *  !-- VERIFY (Middleware)
     *  verify token before enter
     *
     * @return http status code
     */
    static verify(request, response, next) {
        const header = request.headers["authorization"];
        const validToken = header && header.split(" ")[1];
        const accessKey = process.env.ACCESS_KEY;

        if (!validToken) {
            return response.sendStatus(401);
        } else {
            security.verify(validToken, accessKey, (error, auth) => {
                if (error) {
                    response.sendStatus(403);
                } else {
                    next();
                }
            });
        }
    }
    /**
     *  !-- REFRESH (Endpoint)
     *  verify session and create new access_token
     *
     * @return new access_token
     */
    static async refresh(request, response) {
        try {
            const session = request.cookies.session;
            const sessionKey = process.env.SESSION_KEY;

            if (!session) {
                return response.sendStatus(401);
            }
            const user = await UserModel.findOne({ session });
            if (!user && user.session !== session) {
                return response.sendStatus(403);
            }
            security.verify(session, sessionKey, (error, auth) => {
                if (error) {
                    return response.sendStatus(403);
                }
                const credentials = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                };
                const newToken = TokenFactory.create(credentials);
                return response
                    .status(200)
                    .json({ access_token: newToken.access });
            });
        } catch (error) {
            console.log(error);
        }
    }
}
