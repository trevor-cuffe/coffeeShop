import express from "express";
import sessions from "client-sessions";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";

import User from "./models/user.js"
import Cart from "./models/cart.js"

import indexRoutes from "./routes/index.js";
import menuRoutes from "./routes/menuItem.js";
import cartRoutes from "./routes/cart.js";

import randomString from "crypto-random-string";
import seedDB from "./seeds.js";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("images"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//fix mongoose deprecation warnings:
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//connect to Mongo db
let dbUrl = process.env.databaseURL || 'mongodb://localhost:27017/coffee_shop_app';
mongoose.connect(dbUrl, {
    useCreateIndex: true
}).then( () => {
    console.log("connected to DB!");
}).catch( (err) => {
    console.error(err);
});

// seedDB();


//Passport Configuration
let sessionKey = process.env.SESSION_SECRET || randomString({length: 20});
let cartKey = process.env.CART_SECRET || randomString({length: 20});
app.use(sessions({
    cookieName: "session",
    secret: sessionKey,
    duration: 1000 * 60 * 60 * 24,
    activeDuration: 1000 * 60 * 5,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));
app.use(sessions({
    cookieName: "shopping_cart",
    secret: cartKey,
    duration: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    ephemeral: false
}));

//set up new shopping cart if there is not an existing one
app.use((req, res, next) => {
    if(!req.shopping_cart.cart) {
        let newCart = new Cart();
        newCart.saveCart(req);
    }
    return next();
});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());


//Define Local Variables
app.use( (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.currentPath = req.originalUrl;
    res.locals.cart = req.shopping_cart.cart;
    res.locals.error_message = req.flash("error");
    res.locals.success_message = req.flash("success");
    return next();
});


//Include Routes
app.use(indexRoutes);
app.use("/menu", menuRoutes);
app.use("/cart", cartRoutes)




app.get("*", (req, res) => {
    res.render("pageNotFound");
});


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving coffeeShop on port ${port}`);
})