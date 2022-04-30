import express from 'express';
import user_controller from '../controllers/user.js';
import User from "../models/user.js";
import md5 from "md5"

const router = express.Router();

router.get("/login", user_controller.login);
router.get("/logout", user_controller.logout);
router.post("/login", user_controller.auth);

router.get("/edit/:id", (req, res) => {
    User.findOne({where: {id: req.params.id}})
    .then(results => {
        res.render("edit", {
            user: req.session.user || ""
        })
    })
})
router.put("/edit/:id", (req, res) => {
    User.update({
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password)
    }, {where: {id: req.params.id}})
    .then(results => {
        req.session.user = ""
        res.json({status: 200, error: null, Response: results})
    }).catch(err => {
        res.json({status: 502, error: err})
    })
})

export default router;