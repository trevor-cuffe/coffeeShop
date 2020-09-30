let middlewareObj = {}

middlewareObj.loginRequired = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must log in first");
    res.redirect("/login");
}


middlewareObj.restrictToAdmin = (req, res, next) => {
    // if (req.user._id === )
}

export default middlewareObj;