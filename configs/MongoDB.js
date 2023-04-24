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
import mongoose from "mongoose";

dotenv.config();

export default class Database {
    static sync() {
        mongoose
            .connect(process.env.DB_URI, {
                maxPoolSize: 100,
                socketTimeoutMS: 15000,
                wtimeoutMS: 15000,
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
