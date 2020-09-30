import express from "express";
import passport from "passport";
import User from "../models/user.js"

const router = express.Router();


//Home
router.get("/", (req, res) => {
    res.render("home");
});


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
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.error(err);
            res.redirect("register");
        }
        console.log("User Registered");
        passport.authenticate("local")(req, res, () => {
            res.redirect("/menu");
        });
    });
});

//Show Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

//Handle Login Logic
router.post("/login", passport.authenticate("local",
    {
        // failureFlash: true,
        failureRedirect: "/login"
    }), (req, res) => {
        console.log("logged in: " + req.user.username);
        res.redirect("/");
});

//Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/menu");
});


export default router;