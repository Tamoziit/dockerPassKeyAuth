const express = require('express');
const layouts = require("express-ejs-layouts");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const port = process.env.PORT || 3000;
const host = "0.0.0.0";
const db = require("./db/helpers/init");
const multer = require("multer");
const cookieParser = require("cookie-parser");

//Middlewares
const app = express();
app.use(express.json()); //to parse JSON data
app.use(multer().none()); //to submit multi-part form data
app.use(cookieParser()); //to parse auth-cookies
app.use(express.urlencoded({ extended: false }));

//Session Store
const sessionStore = new SequelizeStore({
    db: db,
})

//Templates
app.use(layouts);
app.set("views", path.join(__dirname, "app/views"));
app.set("layout", "layouts/application");
app.set("view engine", "ejs");

//Static files
app.use(express.static(__dirname + "/public"));

//Configuring app to use session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, //1 week
        },
    })
)
sessionStore.sync();
app.use(passport.authenticate("session"));

//Routes
app.use('/', require("./config/routes"));

app.listen(port, host, () => {
    console.log(`Example app listening on port ${port}`)
})