import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: String,
    image: String,
    type: String,
    description: String,
    price: String,
    inStock: Boolean,
})

export default mongoose.model("MenuItem", menuItemSchema);