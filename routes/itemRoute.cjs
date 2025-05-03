const express = require('express');
const router = express.Router();
const ItemData = require('../models/itemModel.cjs');

//Insert Item Route
router.post('/devItem', async (req, res) => {
    try {
        const { item_name, item_desc1, item_desc2, item_id, item_type, item_points, item_img } = req.body;

        // Check if item already exists
        const existItem = await ItemData.findOne({ item_name });
        if (existItem) {
            return res.status(400).json({ message: 'Item already exists' });
        }

        const newItemData = new ItemData({
            item_name,
            item_desc1,
            item_desc2,
            item_id,
            item_type,
            item_points,
            item_img
        });

        await newItemData.save();
        console.log('Item saved: ', newItemData);
        res.status(201).json({ message: 'Item inserted successfully!' });
    } catch (err) {
        console.log('Error Saving Item: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//Get item
router.get('/:id', async (req, res) => {
    try {
        const item = await ItemData.findOne({ item_id: req.params.id });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    }catch(err){
        console.error('Error fetching item:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
module.exports = router;