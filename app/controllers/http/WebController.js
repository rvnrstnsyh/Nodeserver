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

export default class WebController {
    /**
     * !-- VIEWS (SSR)
     *
     * @return render HTML [EJS]
     */
    static async index(request, response) {
        response.status = 200;
        response.render("ssr", { csrfToken: request.csrfToken() });
    }
}
