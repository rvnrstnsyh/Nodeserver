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
import argon2 from "argon2";
import moment from "moment-timezone";
import UserFinder from "../../../functions/UserFinder.js";
import TokenFactory from "../../../functions/TokenFactory.js";
import dotenv from "dotenv";
import { validationResult } from "express-validator";

dotenv.config();

const ssl = process.env.NODE_SECURE.toLowerCase() === "true" ? true : false;

export default class ApiController {
    static async sign_in(request, response) {
        /**
         *  !-- SIGN IN
         *  create new user
         *
         * @return user username and email [JSON]
         */

        // ? request body validation
        const valid = validationResult(request);
        if (!valid.isEmpty()) {
            request.flash("error", valid.errors);
            return response.redirect("/");
        }

        // ? execute sign in
        const { identity } = request.body;
        const uV = await UserFinder.find(identity);

        const credentials = {
            _id: uV._id,
            username: uV.username,
            email: uV.email,
        };

        const newToken = TokenFactory.create(credentials);

        await UserModel.findOneAndUpdate(
            { email: uV.email },
            { session: newToken.session }
        );

        request.flash("access_token", newToken.access);

        return response
            .status(200)
            .cookie("session", newToken.session, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // ? 1 day
                secure: ssl,
            })
            .redirect("/cpanel");
        // ! END LOGIN ---
    }

    static async sign_up(request, response) {
        /**
         *  !-- SIGN UP
         *  create new user
         *
         * @return user username and email [JSON]
         */

        // ? request body validation
        const valid = validationResult(request);
        if (!valid.isEmpty()) {
            request.flash("error", valid.errors);
            return response.redirect("/sign_up");
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
        return response.redirect("/sign_up");
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

            if (!session) {
                return response.sendStatus(204);
            }
            const user = await UserModel.findOne({ session });
            if (!user && user.session !== session) {
                return response.sendStatus(204);
            }
            await UserModel.findOneAndUpdate(
                { email: user.email },
                { session: null }
            );
            response.clearCookie("session").status(200).redirect("/");
        } catch (error) {
            console.log(error);
            response.status(200).redirect("/");
        }
    }
}
