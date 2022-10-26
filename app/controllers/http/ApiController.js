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
import dotenv from "dotenv";
import TokenFactory from "../../../functions/TokenFactory.js";

dotenv.config();

const ssl = process.env.NODE_SECURE.toLowerCase() === "true" ? true : false;
export default class ApiController {
    /**
     *  !-- FIND USERS
     *  find one by identity (email/username) OR find all
     *
     * @return user(s) data [JSON]
     */
    static async GET(request, response) {
        const identity = request.query.f;

        if (await UserFinder.find(identity)) {
            // ? Find by username OR email
            return response.status(200).json({
                status: true,
                message: "200 OK",
                data: await UserFinder.find(identity),
            });
        } else if (!identity) {
            // ? Find ALL
            return response.status(200).json({
                status: true,
                message: "200 OK",
                data: await UserModel.find(),
            });
        } else {
            // ? Not Found
            return response.status(404).json({
                status: false,
                message: "404 Not Found",
            });
        }
    }

    static async POST(request, response) {
        const queryFunction = request.query.qf;

        switch (queryFunction.toLowerCase()) {
            /**
             *  !-- REGISTER
             *  create new user
             *
             * @return user username and email [JSON]
             */
            case "register":
                const { username, email, register_password } = request.body;
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                const name = username ? username : email.match(/^.+(?=@)/)[0];

                if (email.match(regex) && register_password.length > 7) {
                    const newUser = new UserModel({
                        username: name,
                        email: email,
                        password: await argon2.hash(register_password),
                        session: "",
                        created_at: moment().tz("Asia/Jakarta").format(),
                        updated_at: "",
                    });

                    newUser
                        .save()
                        .then(() =>
                            response.status(201).json({
                                status: true,
                                message: "User created!",
                                data: {
                                    username: newUser.username,
                                    email: newUser.email,
                                },
                            })
                        )
                        .catch((error) => {
                            if (error.code === 11000)
                                return response.status(403).json({
                                    status: false,
                                    message: "User already exists",
                                });
                        });
                } else if (!email.match(regex)) {
                    return response.status(403).json({
                        status: false,
                        message: "Invalid email",
                    });
                } else {
                    return response.status(403).json({
                        status: false,
                        message: "Minimum password length is 8 characters",
                    });
                }
                // ! END REGISTER ---
                break;
            /**
             *  !-- LOGIN
             *  verify user and authenticate (login)
             *
             * @return access_token with session cookie (HttpOnly)
             */
            case "login":
                const { identity, login_password } = request.body;
                const uV = await UserFinder.find(identity);

                if (uV) {
                    if (await argon2.verify(uV.password, login_password)) {
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

                        return response
                            .status(200)
                            .cookie("session", newToken.session, {
                                httpOnly: true,
                                maxAge: 24 * 60 * 60 * 1000, // ? 1 day
                                secure: ssl,
                            })
                            .json({
                                status: true,
                                message: "Is valid",
                                access_token: newToken.access,
                            });
                    }
                }
                response.status(401).json({
                    status: false,
                    message: "Wrong credentials.",
                });
                // ! END LOGIN ---
                break;

            default:
                response.status(404).json({
                    status: false,
                    message: "404 Not Found",
                });
                break;
        }
    }

    static async DELETE(request, response) {
        const queryFunction = request.query.qf;

        switch (queryFunction.toLowerCase()) {
            /**
             *  !-- TERMINATE/LOGOUT
             *  delete session cookies and remove session in database
             *
             * @return http status code
             */
            case "terminate":
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
                    response.clearCookie("session").sendStatus(200);
                } catch (error) {
                    console.log(error);
                }
                // ! END TERMINATE/LOGOUT ---
                break;

            default:
                response.status(404).json({
                    status: false,
                    message: "404 Not Found",
                });
                break;
        }
    }
}
