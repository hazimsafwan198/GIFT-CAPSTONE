const express = require('express');
const router = express.Router();
const CartData = require('../models/cartModel.cjs');

//Add item to cart
router.post("/add", async (req, res) => {
  const { user, item_name, item_img, item_points, quantity } = req.body;

  try {
    let cart = await CartData.findOne({ user });
    if (!cart) {
      //New user cart
      cart = new CartData({
        user,
        items: [{ item_name, item_img, item_points, quantity }]
      })
    }else {
      //Check if item already exists in cart
      const existItem = cart.items.find(item =>item.item_name === item_name);
      if(existItem) {
        existItem.quantity += quantity; //Update quantity
      }else {
        cart.items.push({ item_name, item_img, item_points, quantity })
      }
    }
    await cart.save();
    res.status(200).json(cart);
  }catch(err) {
    res.status(500).json({message:"Error adding item to cart", error: err.message});
  }
});

// Get cart items for a user
router.get("/:user", async (req, res) => {
  try{
    const cart = await CartData.findOne({ user: req.params.user });
    if(!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  }catch(err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
});

//Update Cart
router.put("/update", async (req, res) => {
  const { user, item_name, quantity } = req.body;

  try {
    const cart = await CartData.findOne({ user });
    if(!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const item = cart.items.find(item => item.item_name === item_name);
    if(item) {
      item.quantity = quantity; //Update quantity
      await cart.save();
      return res.status(200).json({message: 'Quantity Updated', cart});
    }else {
      return res.status(404).json({message: 'Item not found in cart'});
    }
  }catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
});

//Delete Item from Cart
router.delete('/delete', async (req, res) => {
  const { user, item_name } = req.body;
  try {
    await CartData.updateOne(
      { user },
      { $pull: { items: { item_name } } }
    );
    res.status(200).send('Item removed from cart');
  } catch (err) {
    res.status(500).send('Error removing item');
  }
});

module.exports = router;