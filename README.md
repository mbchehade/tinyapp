# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

## Final Product

!["Screenshot of URLs page"](https://github.com/mbchehade/tinyapp/blob/feature/user-registration/docs/Create-New-URLs%20Page.png?raw=true)
!["Screenshot of Login page"](https://github.com/mbchehade/tinyapp/blob/feature/user-registration/docs/Login-Page.png?raw=true)
!["Screenshot of register page"](https://github.com/mbchehade/tinyapp/blob/feature/user-registration/docs/Register-Page.png?raw=true)
!["Screenshot of URLs page"](https://github.com/mbchehade/tinyapp/blob/feature/user-registration/docs/URLs-Page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- FOLLOW THIS GUIDE CAREFULLY!
- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.


### Setting Up Express

- Initialize NPM
    - npm init 
- Install Express
    - npm install express
- Turn on your server and listen to port!
    - node express_server.js

### Setting Up Nodemon (optional)

- Install Nodemon
    - npm install --save-dev nodemon
- Edit scripts to allow for quick start-up
    - "start": "./node_modules/.bin/nodemon -L express_server.js"
- Start your server!
    - npm start 

### Setting Up EJS

- Install EJS as dependency
    - npm install ejs
- Set EJS as view engine
    - app.set("view engine", "ejs")

### Setting Up BRCYPT

- Install bcrypt package
    - npm install -E bcrypt@2.0.0
- Require bcrypt package
    - const bcrypt = require('bcrypt')

### Cookie-Session Setup

- Install cookie-session
    - npm install cookie-session
- Require cookie-session
    - const cookieSession = require('cookie-session');
