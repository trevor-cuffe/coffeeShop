import mongoose from "mongoose";
import MenuItem from "./models/menuItem.js";

let data = [
    {
        name: "Latte",
        image: "latte.jpg",
        type: "drink",
        description: "A beautiful latte, with your choice of natural flavor",
        price: 3.95,
        inStock: true
    },
    {
        name: "Cold Brew",
        image: "coldBrew.jpg",
        type: "drink",
        description: "Our craft cold brew is a refreshing summer treat",
        price: 4.95,
        inStock: true
    },
    {
        name: "Chai Latte",
        image: "chai.jpg",
        type: "drink",
        description: "Our Chai Latte is made from Indian Chai Tea from Ann Arbor's TeaHaus",
        price: 4,
        inStock: false
    },
    {
        name: "Banana Muffin",
        image: "bananaMuffin.jpg",
        type: "food",
        description: "Made with real bananas! Gluten and dairy free",
        price: 2.50,
        inStock: true
    },
    {
        name: "Cressoint",
        image: "cressoint.jpg",
        type: "food",
        description: "Add chocolate filling for an extra tasty treat!",
        price: 1.50,
        inStock: false
    },
    {
        name: "Avocado Toast",
        image: "avocadoToast.jpg",
        type: "food",
        description: "For all you millenials out there, this is way better than buying a house!",
        price: 6,
        inStock: true
    },
]

function seedDB() {
    //clear existing database
    MenuItem.deleteMany({}, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("removed all menu items");

            //loop through data and add items
            data.forEach( (seed) => {

                MenuItem.create(seed, (err, newMenuItem) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("created new menu item");
                    }

                });

            });

        }
    });

}

export default seedDB;