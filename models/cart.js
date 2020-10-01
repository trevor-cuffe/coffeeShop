'use strict';

class Cart {
    constructor(obj = {items: [], totals: 0, formattedTotals: ''}) {
        this.data = {};
        this.data.items = obj.items;
        this.data.totals = obj.totals;
        this.data.formattedTotals = obj.formattedTotals;
    }

    inCart = (productID = 0) => {
        let index = -1;
        this.data.items.forEach((item, pos) => {
            if(String(item.id) === String(productID)) {
                console.log("match");
                index = pos;
            }
        });
        return index;
    }

    calculateTotals = () => {
        this.data.totals = 0;
        this.data.items.forEach(item => {
            this.data.totals += item.price * item.qty;
        });
        this.setFormattedTotals();
    }

    setFormattedTotals = () => {
        this.data.formattedTotals = "$" + this.data.totals.toFixed(2);
    }

    addToCart = (product = null, qty = 1) => {
        let index = this.inCart(product._id);
        if(index >= 0) {
            this.data.items[index].qty = Number(this.data.items[index].qty) + Number(qty);
        } else {
            this.data.items.push({
                id: product._id,
                qty: qty,
                price: product.price
            });
        }
        this.calculateTotals();
    }

    removeFromCart = (id = 0, qty = 0) => {
        for (let i = 0; i < this.data.items.length; i++) {
            let item = this.data.items[i];
            if (item._id === id) {
                if (qty > 0 && qty < item.qty) {
                    this.data.items[i].qty -= qty;
                } else {
                    this.data.items.splice(i,1);
                }
                this.calculateTotals();
            }
        }
    }

    saveCart = (req) => {
        if(req.shopping_cart) {
            req.shopping_cart.cart = this.data;
        }
    }

    // emptyCart() {

    // }
}

export default Cart;