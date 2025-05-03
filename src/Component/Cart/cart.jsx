import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import OptLogo from '../../assets/logo3.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './cart.css';
import RedeemPopup from '../Redeem/redeem';

const cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedForPopup, setSelectedForPopup] = useState([]);

  //Handle Item Selection
  const handleItemSelect = (index) => {
    setSelectedItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Fetch user from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUser(userObj); // Set user
    } else {
      console.error('No user found in localStorage');
    }
  }, []);

  // Fetch cart items only if user is available
  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/cart/${user.user}`);
          setCartItems(response.data.items); // Set the cart items
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      };

      fetchCartItems();
    }
  }, [user]);

  //Quantity Update
  const updateQuantity = async (index, delta) => {
    const newItems = [...cartItems];
    const updatedItem = {...newItems[index]};
    const newQuantity = updatedItem.quantity + delta;

    if(newQuantity >= 1) {
      updatedItem.quantity = newQuantity;
      newItems[index] = updatedItem;
      setCartItems(newItems);

      try {
        await axios.put('http://localhost:5000/cart/update', {
          user: user.user,
          item_name: updatedItem.item_name,
          quantity: updatedItem.quantity
        });
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }else {
      // Ask for confirmation before deleting the item
      const confirmDelete = window.confirm(`Are you sure you want to remove "${updatedItem.item_name}" from your cart?`);
      if (!confirmDelete) return;
      try {
        await axios.delete('http://localhost:5000/cart/delete', {
          data: {
            user: user.user,
            item_name: updatedItem.item_name
          }
        });
        // Remove from cartItems and selectedItems
        const updatedCart = cartItems.filter((_, i) => i !== index);
        const updatedSelected = { ...selectedItems };
        delete updatedSelected[index];
        // Fix selectedItems index alignment
        const reindexedSelected = {};
        updatedCart.forEach((_, i) => {
          if (selectedItems[i >= index ? i + 1 : i]) {
            reindexedSelected[i] = true;
          }
        });
        setCartItems(updatedCart);
        setSelectedItems(reindexedSelected);
      }catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  if (!user) {
    return <div>Please login to view your cart.</div>;
  }

  const totalPoints = cartItems.reduce((acc, item, index) => {
    return selectedItems[index] ? acc + item.item_points * item.quantity : acc;
  }, 0);
  const notEnoughPoints = user && user.points - totalPoints < 0;

  //Checkout
  const handleCheckout = async () => {
    const selected = cartItems.filter((_, index) => selectedItems[index]);
    if (selected.length === 0) return;

    const redeemedPoints = selected.reduce(
      (total, item) => total + item.item_points * item.quantity,0
    );
    const newPoints = user.points - redeemedPoints;

    try {
      //Update points
      await axios.put('http://localhost:5000/user/update-points', {
        user: user.user,
        newPoints: newPoints
      });
      
      // Update localStorage user points too
      const updatedUser = { ...user, points: newPoints };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      await Promise.all(selected.map(item =>
        axios.delete('http://localhost:5000/cart/delete', {
          data: {
            user: user.user,
            item_name: item.item_name
          }
        })
      ));

      setSelectedForPopup(selected);
      setShowPopup(true);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className='CartContainer'>
      <div className='HeaderCart'>
        <img src={OptLogo} alt="" className='Opt1'/>
      </div>
      <NavBar/>
      <div>
        <h1 className="cartTitle">USER CART</h1>
        {/*Cart Display*/}
        <div className="cartWrapper">
          <div className="cartItemsScrollable">
            {cartItems.length === 0 ? (
              <p className='cartEmp'>Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="cartItem">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[index]}
                    onChange={() => handleItemSelect(index)}
                    className="cartCheckbox"
                  />
                  <img src={item.item_img} alt={item.item_name} className="cartItemImg" />
                  <div className="cartItemDetails">
                    <h2 className='itemTitle'>{item.item_name}</h2>
                    <p className='itemContent'>Points Needed: {item.item_points} pts</p>
                    <div className='actionRow'>
                      <div className='quantitySelect'>
                        <p>Quantity:</p>
                        <button onClick={() => updateQuantity(index, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Total Points Box */}
          {cartItems.length > 0 && (
            <div className="totalPointsBox">
              <div className='totalPointsBoxRow'>
                <p className='pointContent'>Points Available:</p>
                <h2 className='pointContent'>{user.points}</h2>
              </div>
              <div className='totalPointsBoxRow'>
                <p className='pointContent'>Total Points Needed:</p>
                <h2 className='pointContent'>{totalPoints}</h2>
              </div>
              <div className='totalPointsBoxRow'>
                <p className='pointContent'>Points Remaining:</p>
                <h2 className='pointContent' style={{ color: notEnoughPoints ? 'red' : 'black' }}>
                  {user.points - totalPoints}
                </h2>
              </div>
              {notEnoughPoints && (
                 <p className="insufficientPointsWarning">You do not have enough points to checkout.</p>
              )}
              <button className="checkoutBtn" disabled={notEnoughPoints} onClick={handleCheckout}>CHECKOUT</button>
              {showPopup && selectedForPopup.length > 0 && (
                <RedeemPopup 
                  selectedItems={selectedForPopup}
                  onClose={() => {
                    setShowPopup(false);
                    setCartItems(cartItems.filter((_, i) => !selectedItems[i]));
                    setSelectedItems({});
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>Contact Us</p>
            <p>About Us</p>
          </div>
          <div className="footer-right">
            <p>&copy; 2025 GIFT CAPSTONE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default cart
