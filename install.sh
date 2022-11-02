# |-------------------------------------------------------------------------------
# | Nodeserver Copyright © 2021 rvnrstnsyh All Rights Reserved
# |-------------------------------------------------------------------------------
# |
# | Author    : Rivane Rasetiansyah <re@rvnrstnsyh.dev> (https://rvnrstnsyh.dev)
# | GitHub    : https://github.com/rvnrstnsyh
# | GitLab    : https://gitlab.com/rvnrstnsyh
# |

#!/bin/sh

install(){
  { # Try
  yarn install && \

  yarn add \
            argon2@latest \
            btoa@latest \
            connect-flash@latest \
            cookie-parser@latest \
            cors@latest \
            crypto-js@latest \
            csrf@latest \
            dayjs@latest \
            dotenv@latest \
            eccrypto@latest \
            ejs@latest \
            elliptic@latest \
            express@latest \
            express-ejs-layouts@latest \
            express-rate-limit@latest \
            express-session@latest \
            express-validator@latest \
            helmet@latest \
            jsonwebtoken@latest \
            moment-timezone@latest \
            mongoose@latest \
            morgan@latest \
            --dev nodemon@latest \
            socket.io@latest \
            svg-captcha@latest \
            svg2img@latest \
            --dev tailwindcss@latest \
            uuid@latest && \

  cp .env.example .env && yarn dev
} || { # Catch
  npm install && \

  npm install \
            argon2@latest \
            btoa@latest \
            connect-flash@latest \
            cookie-parser@latest \
            cors@latest \
            crypto-js@latest \
            csrf@latest \
            dayjs@latest \
            dotenv@latest \
            eccrypto@latest \
            ejs@latest \
            elliptic@latest \
            express@latest \
            express-ejs-layouts@latest \
            express-rate-limit@latest \
            express-session@latest \
            express-validator@latest \
            helmet@latest \
            jsonwebtoken@latest \
            moment-timezone@latest \
            mongoose@latest \
            morgan@latest \
            --dev nodemon@latest \
            socket.io@latest \
            svg-captcha@latest \
            svg2img@latest \
            --dev tailwindcss@latest \
            uuid@latest && \

  cp .env.example .env && npm run dev
 }
}

# Call
install
