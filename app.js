import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import MenuItem from "./models/menuItem.js";
import seedDB from "./seeds.js";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.set("view engine", "ejs");

//fix mongoose deprecation warnings:
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//connect to Mongo db
mongoose.connect('mongodb://localhost:27017/coffee_shop_app');

// seedDB();

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/menu", (req, res) => {

    MenuItem.find({type:"drink"}, (err, drinkItems) => {
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            MenuItem.find({type:"food"}, (err, foodItems) => {
                if (err) {
                    console.error(err);
                    res.redirect("/");
                } else {
                    res.render("menu", {drinkItems: drinkItems, foodItems, foodItems});
                }
            })
        }
    })

});



app.get("*", (req, res) => {
    res.render("pageNotFound");
});


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving coffeeShop on port ${port}`);
})