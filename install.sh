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
            cookie-parser@latest \
            cors@latest \
            crypto-js@latest \
            csurf@latest \
            dayjs@latest \
            dotenv@latest \
            eccrypto@latest \
            ejs@latest \
            elliptic@latest \
            express@latest \
            express-ejs-layouts@latest \
            express-rate-limit@latest \
            helmet@latest \
            jsonwebtoken@latest \
            moment-timezone@latest \
            mongoose@latest \
            morgan@latest \
            nodemon@latest \
            socket.io@latest && \

  cp .env.example .env && yarn dev
} || { # Catch
  npm install && \

  npm install \
            argon2@latest \
            cookie-parser@latest \
            cors@latest \
            crypto-js@latest \
            csurf@latest \
            dayjs@latest \
            dotenv@latest \
            eccrypto@latest \
            ejs@latest \
            elliptic@latest \
            express@latest \
            express-ejs-layouts@latest \
            express-rate-limit@latest \
            helmet@latest \
            jsonwebtoken@latest \
            moment-timezone@latest \
            mongoose@latest \
            morgan@latest \
            nodemon@latest \
            socket.io@latest && \

  cp .env.example .env && npm run dev
 }
}

# Call
install