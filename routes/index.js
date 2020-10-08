import express from "express";
import passport from "passport";
import Cart from "../models/cart.js";
import User from "../models/user.js"

const router = express.Router();


//Home
router.get("/", (req, res) => {
    res.render("home");
});

//About
router.get("/about", (req, res) => {
    res.render("about");
})


//===========
//Auth Routes
//===========

//Show Registration Page
router.get("/register", (req, res) => {
    res.render("register");
});

//Handle Signup Logic
router.post("/register", (req, res) => {
    console.log("post route reached");
    let newUser = new User({username: req.body.username});
    if (process.env.adminCode && process.env.adminCode === req.body.adminCode) {
        req.flash("success","Admin privileges assigned");
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.error(err);
            req.flash("error", err.message);
            res.redirect("register");
        }
        console.log("User Registered");
        req.flash("success", `Welcome, ${newUser.username}`);
        passport.authenticate("local")(req, res, () => {
            res.redirect("/menu");
        });
    });
});

//Show Login Page
router.get("/login", (req, res) => {
    if(req.user) {
        req.flash("error", "You are already logged in");
        res.redirect("back");
    } else {
        res.render("login");
    }
});

//Handle Login Logic
router.post("/login", passport.authenticate("local",
    {
        failureFlash: true,
        failureRedirect: "/login"
    }), (req, res) => {
        console.log("logged in: " + req.user.username);
        req.flash("success", `Logged in as ${req.user.username}`);
        res.redirect("/");
});

//Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/menu");
});


export default router;