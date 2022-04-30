const forUser = (req, res, next) => {
    let user = req.session.user || "";
    if (!user) return next();
    res.redirect("/")
}

export default forUser;