import express from "express";
import User from "./models/user.js"
import session from "express-session"

import user_routes from "./routers/user.js"
import forUser from "./controllers/auth.js";

const port = 666;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'aw12',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 3600*24}
}))
app.use(express.static('public'))

app.use("/user/login", forUser)
app.use("/user", user_routes)

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    User.findAll().then(results => {
        let user = req.session.user || ""
        res.render("index", {
            user
        })
    })
})

app.get("/*", (req, res) => {
    res.render("unknown")
})

app.listen(port, () => console.log(`Server running at localhost:${port}`))