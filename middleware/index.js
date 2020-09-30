let middlewareObj = {}

middlewareObj.loginRequired = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


middlewareObj.restrictToAdmin = (req, res, next) => {

}

export default middlewareObj;