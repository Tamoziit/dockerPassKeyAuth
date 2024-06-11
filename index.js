const express = require('express')
const layouts = require("express-ejs-layouts");
const path = require("path");
const port = process.env.PORT || 3000;
const host = "0.0.0.0";

const app = express()

//Templates
app.use(layouts);
app.set("views", path.join(__dirname, "app/views"));
app.set("layout", "layouts/application");
app.set("view engine", "ejs");

//Static files
app.use(express.static(__dirname + "/public"));

//Routes
app.use('/', require("./config/routes"));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})