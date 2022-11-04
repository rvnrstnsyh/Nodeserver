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

import CaptchaFactory from "../../../functions/CaptchaFactory.js";

export default class WebController {
    /**
     * !-- VIEWS (SSR)
     *
     * @return render HTML [EJS]
     */
    static async sign_in(request, response) {
        const { base64, text, cookieConfig } = CaptchaFactory.create();

        return response
            .status(200)
            .cookie("captcha", text, cookieConfig)
            .render("sign_in", {
                csrfToken: request.csrfToken(),
                layout: "../layouts/indexssr",
                successMsg: request.flash("success"),
                errorsMsg: request.flash("error"),
                captcha: base64,
                invalid_captcha: request.flash("invalid_captcha"),
            });
    }
    static async sign_up(request, response) {
        const { base64, text, cookieConfig } = CaptchaFactory.create();

        return response
            .status(200)
            .cookie("captcha", text, cookieConfig)
            .render("sign_up", {
                csrfToken: request.csrfToken(),
                layout: "../layouts/indexssr",
                successMsg: request.flash("success"),
                errorsMsg: request.flash("error"),
                captcha: base64,
                invalid_captcha: request.flash("invalid_captcha"),
            });
    }
    static async cpanel(request, response) {
        return response.status(200).render("cpanel", {
            csrfToken: request.csrfToken(),
            layout: "../layouts/indexssr",
            successMsg: request.flash("success"),
            errorsMsg: request.flash("error"),
            auth: request.body.auth,
        });
    }
    static async handler(request, response) {
        return response.status(200).render("error_handler", {
            csrfToken: request.csrfToken(),
            layout: "../layouts/indexssr",
            successMsg: request.flash("success"),
            errorsMsg: request.flash("error"),
            invalid: request.flash("invalid"),
        });
    }
}
