import express from "express";
import mongoose from "mongoose";
import middleware from "../middleware/index.js"
import Cart from "../models/cart.js";
import MenuItem from "../models/menuItem.js";

const router = express.Router();

//view cart
router.get('/', middleware.loginRequired, (req, res) => {
    //check if there's a current shopping cart session
    if(!req.shopping_cart.cart) {
        req.flash("Error loading cart");
        res.redirect("/menu");
    }

    let shoppingCart = req.shopping_cart.cart.items;

    //create an array of ids of the correct type
    let ids = [];
    shoppingCart.forEach(item => {
        ids.push(item.id);
    });

    //find all matching menu items
    MenuItem.find({'_id': { $in: ids}}, (err, menuItems) => {
        if (err) {
            console.error(err);
            req.flash("error", "Error loading cart");
            res.redirect("/menu");
        } else {
            //merge menuItems with array containing quantities
            let cartItems = [];
            for(let i = 0; i<menuItems.length; i++) {
                cartItems.push(menuItems[i]);
                for(let j = 0; j < shoppingCart.length; j++) {
                    if (String(shoppingCart[j].id) === String(menuItems[i]._id)) {
                        console.log("MATCH");
                        cartItems[i].quantity = shoppingCart[j].qty;
                    }
                }
            }
            res.render("cart", {cartItems: cartItems});
        }
    });

});

//add to cart
router.post('/', middleware.loginRequired, (req, res) => {
    let qty = req.body.quantity;
    MenuItem.findById(req.body.productId, (err, menuItem) => {
        if(err || !req.shopping_cart.cart) {
            console.error(err || "Shopping cart not found");
            req.flash("error", "Error: Item not added to cart");
        } else {
            let newCart = new Cart(req.shopping_cart.cart);
            newCart.addToCart(menuItem, qty);
            newCart.saveCart(req);
            req.flash("success", "Added item to cart");
        }
        
        res.redirect("/menu");

    });
});



export default router;