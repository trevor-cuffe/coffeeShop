import express from "express";
import MenuItem from "../models/menuItem.js";
import middleware from "../middleware/index.js";

const router = express.Router();

//INDEX
router.get("/", (req, res) => {

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
router.get("/new", middleware.loginRequired, (req, res) => {
    res.render("menu/new");
});

//CREATE
router.post("/", middleware.loginRequired, (req, res) => {
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
router.get("/:id", (req, res) => {
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
router.get("/:id/edit", middleware.loginRequired, (req, res) => {
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

router.put("/:id", middleware.loginRequired, (req, res) => {
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
router.delete("/:id", middleware.loginRequired, (req, res) => {
    let id = req.params.id;
    MenuItem.findByIdAndDelete(id, (err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect("/menu");
        }
    })
});


export default router;