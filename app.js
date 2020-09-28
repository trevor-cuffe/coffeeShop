import express from "express";
import expressSanitizer from "express-sanitizer";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import MenuItem from "./models/menuItem.js";
import seedDB from "./seeds.js";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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

app.get("/", (req, res) => {
    res.render("home");
});

//INDEX
app.get("/menu", (req, res) => {

    MenuItem.find({type:"coffee"}, (err, coffeeItems) => {
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            coffeeItems.sort((a,b) => (a.name > b.name) ? 1: -1);
            MenuItem.find({type:"tea"}, (err, teaItems) => {
                if (err) {
                    console.error(err);
                    res.redirect("/");
                } else {
                    teaItems.sort((a,b) => (a.name > b.name) ? 1: -1);
                    MenuItem.find({type:"food"}, (err, foodItems) => {
                        if (err) {
                            console.error(err);
                            res.redirect("/");
                        } else {
                            foodItems.sort((a,b) => (a.name > b.name) ? 1: -1);
                            res.render("menu/index", {coffeeItems: coffeeItems, teaItems: teaItems, foodItems, foodItems});
                        }
                    });
                }
            });
        }
    });

});

//NEW
app.get("/menu/new", (req, res) => {
    res.render("menu/new");
});

//CREATE
app.post("/menu", (req, res) => {
    let newMenuItem = req.body.menuItem;
    if (!newMenuItem.image) {
        newMenuItem.image = "/images/default.jpg";
    }
    newMenuItem.description = req.sanitize(newMenuItem.description);
    MenuItem.create(newMenuItem, (err, menuItem) => {
        if (err) {
            console.error(err);
            res.render("new");
        } else {
            res.redirect("/menu");
        }
    })
});


//SHOW
app.get("/menu/:id", (req, res) => {
    let id = req.params.id;
    MenuItem.findById(id, (err, menuItem) => {
        if (err) {
            console.error(err);
            res.redirect("/menu");
        } else {
            res.render("menu/show", {menuItem: menuItem})
        }

    });
});

//EDIT
app.get("/menu/:id/edit", (req, res) => {
    let id = req.params.id;
    MenuItem.findById(id, (err, menuItem) => {
        if (err) {
            console.error(err);
            res.redirect("/menu");
        } else {
            res.render("menu/edit", {menuItem: menuItem})
        }

    });
});

//UPDATE

app.put("/menu/:id", (req, res) => {
    let id = req.params.id;
    let newMenuItem = req.body.menuItem;
    if (!newMenuItem.image) {
        newMenuItem.image = "/images/default.jpg";
    }
    newMenuItem.description = req.sanitize(newMenuItem.description);

    MenuItem.findByIdAndUpdate(id, newMenuItem, (err, updatedMenuItem) => {
        if(err) {
            console.error(err);
            res.redirect("/menu");
        } else {
            res.redirect(`/menu/${id}/`);
        }
    });
});

//DELETE
app.delete("/menu/:id", (req, res) => {
    let id = req.params.id;
    MenuItem.findByIdAndDelete(id, (err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect("/menu");
        }
    })
})




app.get("*", (req, res) => {
    res.render("pageNotFound");
});


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving coffeeShop on port ${port}`);
})