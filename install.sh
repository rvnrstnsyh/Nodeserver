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
            dayjs@latest \
            moment-timezone@latest \
            mongoose@latest \
            morgan@latest \
            jsonwebtoken@latest \
            cookie-parser@latest \
            cors@latest \
            csurf@latest \
            dotenv@latest \
            ejs@latest \
            express@latest \
            express-rate-limit@latest \
            socket.io@latest \
            nodemon@latest \
            eccrypto@latest \
            crypto-js@latest \
            elliptic@latest && \

  cp .env.example .env && yarn dev
} || { # Catch
  npm install && \

  npm install \
            argon2@latest \
            dayjs@latest \
            moment-timezone@latest \
            mongoose@latest \
            morgan@latest \
            jsonwebtoken@latest \
            cookie-parser@latest \
            cors@latest \
            csurf@latest \
            dotenv@latest \
            ejs@latest \
            express@latest \
            express-rate-limit@latest \
            socket.io@latest \
            nodemon@latest \
            eccrypto@latest \
            crypto-js@latest \
            elliptic@latest && \

  cp .env.example .env && npm run dev
 }
}

# Call
install