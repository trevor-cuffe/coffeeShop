import express from "express";
import Stripe from "stripe";
import Cart from "../models/cart.js";
import MenuItem from "../models/menuItem.js";

const router = express.Router();

//Set Stripe Keys
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const stripe = new Stripe(stripeSecretKey);

//view cart
router.get('/', (req, res) => {
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
                        cartItems[i].quantity = shoppingCart[j].qty;
                    }
                }
            }
            res.render("cart", {
                stripePublicKey: stripePublicKey,
                cartItems: cartItems
            });
        }
    });

});

//add to cart
router.post('/', (req, res) => {
    let qty = req.body.quantity;
    MenuItem.findById(req.body.productId, (err, menuItem) => {
        if(err || !req.shopping_cart.cart) {
            console.error(err || "Shopping cart not found");
            req.flash("error", "Error: Item not added to cart");
        } else {
            let newCart = new Cart(req.shopping_cart.cart);
            newCart.addToCart(menuItem, qty);
            newCart.saveCart(req);
            req.flash("success", "Added item to cart! <strong class='ml-3'>(<a href='/cart'>Go To Cart</a>)</strong>");
        }
        res.redirect(req.get('referrer'));
        // res.redirect("/menu");

    });
});

//empty cart
router.delete('/', (req, res) => {
    req.shopping_cart.cart.items = [];
    req.flash("success", "Your cart is now empty");
    res.redirect("/cart");
});

//delete item
router.delete('/:id', (req, res) => {
    if(!req.shopping_cart.cart.items) {
        req.flash("error", "ERROR: Could not find shopping cart");
        res.redirect("/menu");
    }

    let found = false;
    req.shopping_cart.cart.items.forEach((item, index) => {
        if (item.id === req.params.id) {
            req.shopping_cart.cart.items.splice(index,1);
            req.flash("success", "Item removed from cart");
            found = true;
        }
    });
    
    if (!found) req.flash("error", "Error: Could not remove item");
    res.redirect("/cart");
})

//check out
router.post('/create-checkout-session', async (req, res) => {

    const purchaseData = req.body.purchaseData;
    let lineItems = await Promise.all(purchaseData.map( async item => {
        const foundItem = await MenuItem.findById(item.id);
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: foundItem.name,
                },
                unit_amount: foundItem.price * 100,
            },
            quantity: item.quantity,
        }
    }));
    console.log(lineItems);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'https://cuffee-grounds.herokuapp.com/menu',
        cancel_url: 'https://cuffee-grounds.herokuapp.com/cart',
    });

    res.send({ id: session.id });


    // let total = req.body.total;
    // req.shopping_cart.cart.items = [];
    // req.flash("success", "Thank you for shopping at Cuffee Grounds! Your total was $" + Number(total).toFixed(2));
    // res.redirect("/menu");
})



export default router;