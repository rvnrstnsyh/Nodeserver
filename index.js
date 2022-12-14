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

// ! +--------------------------------------------------------------------------+
// ! | Dependencies and third parties                                           |
// ! +--------------------------------------------------------------------------+
import fs from "fs";
import cors from "cors";
import PATH from "path";
import http from "http";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import useragent from "express-useragent";
import expressLayouts from "express-ejs-layouts";

import { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

// ! +--------------------------------------------------------------------------+
// ! | Server configurations                                                    |
// ! +--------------------------------------------------------------------------+
const App = express();
const server = http.createServer(App);
const HOST = process.env.APP_HOST || "localhost";
const PORT = process.env.APP_PORT || 8000;
const URI = `http://${HOST}:${PORT}`;
const CORS = /^.+localhost(3000|8080|8000)$/;
const CONF = {
    origin: CORS || URI,
    optionsSuccesStatus: 200,
};

// ! +--------------------------------------------------------------------------+
// ! | Cross-site request forgery (CSRF)                                        |
// ! +--------------------------------------------------------------------------+
import * as middleware from "./app/middleware/_index.js";

// ! +--------------------------------------------------------------------------+
// ! | Global request limit, DDOS attack mitigation                             |
// ! +--------------------------------------------------------------------------+
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ? 15 minutes
    max: 500, // ? Limit each IP to 500 requests per windowMs
    // ? If the request has exceeded the limit, give a message
    message: {
        status: false,
        code: 429,
        message: "Too many requests, Your IP is temporarily blocked.",
    },
});

// ?  Apply to all web requests
App.use(limiter);

// ? Secure App by setting various HTTP headers
App.use(helmet({ contentSecurityPolicy: false }));

// ! +--------------------------------------------------------------------------+
// ! | Express configurations                                                   |
// ! +--------------------------------------------------------------------------+
import RESTful_API from "./routes/api.js";
import webRoutes from "./routes/web.js";

const SSR = process.env.NODE_SSR.toLowerCase() === "true";
const accessLogStream = fs.createWriteStream(
    PATH.join(__dirname, "access.log"),
    { flags: "a" }
);
const accessLogFormat = `:remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`;

App.locals.baseURL = PATH.join("/");

App.use((request, response, next) => {
    console.log(`${request.method} ${URI}${request.url}`);
    next();
    // ! +--------------------------------------------------------------------------+
    // ! | Protocol condition (Force HTTPS) -Uncomment on production server         |
    // ! +--------------------------------------------------------------------------+
    // if (request.header("x-forwarded-proto") !== "https") {
    //   response.redirect(`https://${request.header("host")}${request.url}`);
    // } else {
    //   next();
    // }
})
    .use(morgan(accessLogFormat, { stream: accessLogStream }))
    .use(cors(CONF))
    .use(cookieParser("secret"))
    .use(
        session({
            cookie: {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "strict",
                secure: false,
            },
            secret: "secret",
            resave: true,
            saveUninitialized: true,
        })
    )
    .use(flash())
    .use(express.json())
    .use(useragent.express())
    .use(express.urlencoded({ extended: true }))
    .set("view engine", "ejs")
    .use(expressLayouts)
    .use(express.static(PATH.join(__dirname + "/public")))
    .use("/api", RESTful_API)
    .use("/", SSR ? webRoutes : express.static(PATH.join(__dirname, "/dist")))
    .get(/.*/, middleware.csrf, (request, response) => {
        if (SSR) {
            // ? Server-side Rendering
            return response.sendStatus(404);
        } else {
            // ? Front-End Framework
            return response
                .cookie("nodeserver_key", request.csrfToken())
                .render(PATH.join(__dirname, "/dist/index"), {
                    csrfToken: request.csrfToken(),
                    layout: "../layouts/indexfe",
                });
        }
    });

// ! +--------------------------------------------------------------------------+
// ! | Database connection (Default MongoDB)                                    |
// ! +--------------------------------------------------------------------------+
import Database from "./configs/MongoDB.js";
if (process.env.DB_CONNECTION === "mongodb") {
    Database.sync();
} else if (process.env.DB_CONNECTION !== "") {
    console.log(`${process.env.DB_CONNECTION} Not found`);
} else {
    console.log("No database connection");
}

// ! +--------------------------------------------------------------------------+
// ! | Socket.io connection and handler                                         |
// ! +--------------------------------------------------------------------------+
import SocketController from "./app/controllers/websocket/SocketController.js";
import { Server as socketConfig } from "socket.io";
const io = new socketConfig(server, {
    cors: {
        origin: URI,
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true,
    },
});

SocketController.handler(io);

// ! +--------------------------------------------------------------------------+
// ! | Server listening                                                         |
// ! +--------------------------------------------------------------------------+
server.listen(PORT, () => {
    if (SSR) {
        console.log(`CORS|CSRF|SSR enabled, nodeserver is listening on ${URI}`);
    } else {
        console.log(`CORS|CSRF enabled, nodeserver is listening on ${URI}`);
    }
});

server.on("connection", (socket) => {
    // 10 minutes timeout
    socket.setTimeout(10 * 60 * 1000);
});
