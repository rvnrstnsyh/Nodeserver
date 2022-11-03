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

export default class SocketController {
    /**
     * !-- SOCKET.IO (Second Controller)
     *
     * @return response message
     */
    static async handler(io) {
        io.on("connection", (socket) => {
            socket.emit("connection_response", {
                message: "Socket connected.",
            });
        });
    }
}
