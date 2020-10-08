import express from "express";
import MenuItem from "../models/menuItem.js";
import middleware from "../middleware/index.js";
import expressSanitizer from "express-sanitizer";


const router = express.Router();

router.use(expressSanitizer());


//INDEX
router.get("/", (req, res) => {

    MenuItem.find({type:"coffee"}, (err, coffeeItems) => {
        if (err) {
            console.error(err);
            req.flash("error", "Error loading menu items");
            res.redirect("/");
        } else {
            coffeeItems.sort((a,b) => (a.name > b.name) ? 1: -1);
            MenuItem.find({type:"tea"}, (err, teaItems) => {
                if (err) {
                    console.error(err);
                    req.flash("error", "Error loading menu items");
                    res.redirect("/");
                } else {
                    teaItems.sort((a,b) => (a.name > b.name) ? 1: -1);
                    MenuItem.find({type:"food"}, (err, foodItems) => {
                        if (err) {
                            console.error(err);
                            req.flash("error", "Error loading menu items");
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
router.get("/new", middleware.restrictToAdmin, (req, res) => {
    res.render("menu/new");
});

//CREATE
router.post("/", middleware.restrictToAdmin, (req, res) => {
    let newMenuItem = req.body.menuItem;
    if (!newMenuItem.image) {
        newMenuItem.image = "/images/default.jpg";
    }
    newMenuItem.description = req.sanitize(newMenuItem.description);
    MenuItem.create(newMenuItem, (err, menuItem) => {
        if (err) {
            console.error(err);
            req.flash("error", "Error creating new menu item");
            res.render("new");
        } else {
            req.flash("success", `New menu item '${menuItem.name}' successfully created`);
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
            req.flash("error", "Could not load item");
            res.redirect("/menu");
        } else {
            res.render("menu/show", {menuItem: menuItem})
        }

    });
});

//EDIT
router.get("/:id/edit", middleware.restrictToAdmin, (req, res) => {
    let id = req.params.id;
    MenuItem.findById(id, (err, menuItem) => {
        if (err) {
            console.error(err);
            req.flash("error", "Error loading page");
            res.redirect("/menu");
        } else {
            res.render("menu/edit", {menuItem: menuItem});
        }

    });
});

//UPDATE

router.put("/:id", middleware.restrictToAdmin, (req, res) => {
    let id = req.params.id;
    let newMenuItem = req.body.menuItem;
    if (!newMenuItem.image) {
        newMenuItem.image = "/images/default.jpg";
    }
    newMenuItem.description = req.sanitize(newMenuItem.description);

    MenuItem.findByIdAndUpdate(id, newMenuItem, (err, updatedMenuItem) => {
        if(err) {
            console.error(err);
            req.flash("error", "Error updating menu item");
            res.redirect("/menu");
        } else {
            req.flash("success", `'${newMenuItem.name}' successfully updated!`);
            res.redirect(`/menu/${id}/`);
        }
    });
});

//DELETE
router.delete("/:id", middleware.restrictToAdmin, (req, res) => {
    let id = req.params.id;
    MenuItem.findByIdAndDelete(id, (err) => {
        if (err) {
            req.flash("error", "Error deleting menu items");
            console.error(err);
        } else {
            req.flash("success", "Menu item successfully deleted");
            res.redirect("/menu");
        }
    })
});


export default router;