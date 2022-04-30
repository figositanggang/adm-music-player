import User from "../models/user.js";
import md5 from "md5"

const login = (req, res, next) => {
    let
        message = req.session.err || "",
        user = req.session.user;
    req.session.err = ""
    res.render("login", {
        user,
        message
    })

}

const logout = (req, res, next) => {
    req.session.destroy()
    res.redirect("/")
}

const auth = (req, res, next) => {
    const data = {
        email: req.body.email,
        password: md5(req.body.password)
    }
    User.findOne({
        where: {
            email: data.email,
        }
    }).then(results => {
        if (!results) {
            req.session.err = "User tidak ditemukan"
            res.redirect("/user/login")
        } else if(data.password !== results.password) {
            req.session.err = "Password Salah"
            console.log(data.password, results.password);
            res.redirect("/user/login")
        } else {
            req.session.user = results
            res.redirect("/")
        }
    }).catch(err => {
        req.session.err = "Error Query Database"
    })
}

export default {login, logout, auth}