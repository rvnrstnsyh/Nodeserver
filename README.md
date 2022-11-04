<div class="logoContainer">
  <a href="https://nodejs.org/en" rel="noopener noreferrer nofollow" target="_blank">
    <img width="300" alt="NodeJs" src="https://pluspng.com/img-png/nodejs-png-nodejs-icon-png-50-px-1600.png" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://www.ibm.com/cloud/learn/rest-apis" rel="noopener noreferrer nofollow" target="_blank">
    <img width="270" alt="NodeJs" src="https://i1.wp.com/saixiii.com/wp-content/uploads/2017/04/api-icon.png?fit=700%2C350&ssl=1" />
  </a>
</div>


# Nodeserver
Nodeserver is a Back-End server template or framework that has been prepared in such a way that it is ready to use.

## Ready-to-use Features
- Model view controller (MVC)
- Server-side rendering (SSR)
- Templating engine (EJS)
- Tailwind CSS
- Cross-origin resource sharing (CORS)
- Cross-site request forgery (CSRF)
- Request limit, DDOS attack mitigation
- RESTful API
- Authentication and Authorization
- Captcha base64
- Argon2 hashing
- Web socket
- Front-End framework support
- JSON Web Tokens
- MongoDB Integration

## Requirements
- NodeJs
- NPM
- Yarn (**optional**)
- MongoDB
- Linux or use Git bash on Windows (**optional**)

## Installation
First create a MongoDB database (default **nodeserver_db**), configurable in `.env` file.
```shell
$ git clone https://gitlab.com/rvnrstnsyh/nodeserver.git
$ cd nodeserver && yarn ignite
```
The `ignite` command will install all required dependencies and watching tailwind css. Let this process run, and open a new terminal to run the web server.
```shell
$ yarn dev
```
Open in browser on default host and port http://localhost:3000

## Author and Contributors
<p>
  <b>Rivane Rasetiansyah</b>
  &lt;<a href="mailto:re@rvnrstnsyh.dev?subject=[Feedback] Customize Your Subject&body=Message body, please attach Your public PGP key if You want Me to reply encrypted.">re@rvnrstnsyh.dev</a>&gt; 
  (<a href="https://rvnrstnsyh.dev" rel="noopener noreferrer nofollow" target="_blank">https://rvnrstnsyh.dev</a>)
</p>

## License
MIT
