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

import UserModel from "../../models/User.js";
import cookieConfig from "../../../functions/Cookie.js";
import UserFinder from "../../../functions/UserFinder.js";
import TokenFactory from "../../../functions/TokenFactory.js";

import argon2 from "argon2";
import dotenv from "dotenv";
import moment from "moment-timezone";

import { v4 as uuidv4 } from "uuid";
import { validationResult } from "express-validator";

dotenv.config();
export default class ApiController {
    static async sign_in(request, response) {
        /**
         *  !-- SIGN IN
         *  authenticate user
         *
         * @return redirect url
         */

        // ? request body validation
        const valid = validationResult(request);

        if (!valid.isEmpty()) {
            request.flash("error", valid.errors);
            return response.status(301).redirect("/");
        }

        // ? execute sign in
        const { identity } = request.body;
        const user = await UserFinder.find(identity);

        const credentials = {
            _id: user._id,
            uuidv4: uuidv4(),
            agent: request.useragent.source,
            username: user.username,
            email: user.email,
        };

        const newToken = TokenFactory.create(credentials);

        const session = {
            uuidv4: credentials.uuidv4,
            agent: request.useragent.source,
            value: newToken.session,
        };

        await UserModel.findOneAndUpdate(
            { email: user.email },
            { $push: { session: session } }
        );

        return response
            .status(301)
            .cookie("session", newToken.session, cookieConfig)
            .redirect("/cpanel");
    }

    static async sign_up(request, response) {
        /**
         *  !-- SIGN UP
         *  create new user
         *
         * @return redirect url
         */

        // ? request body validation
        const valid = validationResult(request);

        if (!valid.isEmpty()) {
            request.flash("error", valid.errors);
            return response.status(301).redirect("/sign_up");
        }

        // ? execute sign up
        const { username, email, signup_password } = request.body;

        const newUser = new UserModel({
            username: username,
            email: email,
            password: await argon2.hash(signup_password),
            session: "",
            created_at: moment().tz("Asia/Jakarta").format(),
            updated_at: "",
        });

        const user = await newUser.save();

        request.flash("success", `${user.email} registered successfully`);
        return response.status(301).redirect("/sign_up");
    }
    static async sign_out(request, response) {
        /**
         *  !-- TERMINATE/LOGOUT
         *  delete session cookies and remove session in database
         *
         * @return http status code
         */
        try {
            const session = request.cookies.session;
            const users = await UserModel.find();

            if (!session) {
                return response.sendStatus(204);
            }

            users.forEach((user) => {
                user.session.forEach(async (token) => {
                    if (token.value === session) {
                        const newSession = user.session.filter(
                            (data) => data.value !== session
                        );
                        await UserModel.findOneAndUpdate(
                            { email: user.email },
                            { session: newSession }
                        );
                    }
                });
            });
            return response.clearCookie("session").status(301).redirect("/");
        } catch (error) {
            console.log(error);
            return response.status(301).redirect("/");
        }
    }
}
