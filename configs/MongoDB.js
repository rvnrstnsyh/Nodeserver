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

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default class Database {
    static sync() {
        mongoose
            .connect(process.env.DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log("MongoDB connected");
                return true;
            })
            .catch(() => {
                console.log("MongoDB not connected");
                return false;
            });
    }
}
