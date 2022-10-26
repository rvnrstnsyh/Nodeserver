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

import UserModel from "../app/models/User.js";

export default class UserFinder {
    /**
     *  !-- FINDER (Function)
     *  find by username OR email
     *
     * @return user(s) data [JSON]
     */
    static async find(identity) {
        const byUsername = await UserModel.find({ username: identity });
        const byEmail = await UserModel.find({ email: identity });

        return byUsername[0] ? byUsername[0] : byEmail[0];
    }
}
