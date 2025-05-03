const mongoose = require("mongoose");

//Add Item to Cart
const CartSchema = new mongoose.Schema({
  user: { type: String, required: true },
  items: [
    {
      item_name: { type: String, required: true },
      item_img: { type: String, required: true },
      item_points: { type: Number, required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
});
const CartData = mongoose.model('CartData', CartSchema, 'CartData');

module.exports = CartData;