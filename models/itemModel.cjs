const mongoose = require('mongoose');

//Add data here if new data arrive
const ItemSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    item_desc1: { type: String, required: true },
    item_desc2: { type: String, required: true },
    item_id: { type: Number, required: true },
    item_type: { type: String, required: true },
    item_points: { type: Number, required: true },
    item_img: { type: String, required: true },
});

const ItemData = mongoose.model('ItemData', ItemSchema, 'ItemData');

module.exports = ItemData;