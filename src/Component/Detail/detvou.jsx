import React, { use, useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar'
import OptLogo from '../../assets/logo3.png'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './detvou.css'


const detvou = () => {
  const { id } = useParams(); // this will be item_id
  const [user, setUser] = useState(null);
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showTC, setShowTC] = useState(false);
  const navigate = useNavigate();

  const handleShowTC = () => setShowTC(true);
  const handleCloseTC = () => setShowTC(false);

  //Function to get user
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      console.log('✅ User object:', userObj);
      setUser(userObj);
    } else {
      console.error('❌ No user found in localStorage');
    }
  }, []);

  //Function to add item to cart
  const handleAddToCart = async () => {
    try {
      if(!user) {
        alert('Please login to add items to your cart.');
        return;
      }
      const cartItem = {
        user: user.user,
        item_name: item.item_name,
        item_img: item.item_img,
        item_points: item.item_points,
        quantity: quantity
      };
      console.log("🛒 Attempting to add to cart:", cartItem);
      const response = await axios.post('http://localhost:5000/cart/add', cartItem);
      if (response.status === 200) {
        alert('Item added to cart successfully!');
      }else {
        alert('Failed to add item to cart. Please try again.');
      }
    }catch (error) {
      console.error('Error adding item to cart:', error);
      alert('An error occurred while adding the item to the cart. Please try again.');
    }
  };

  //Redeem Function
  const handleRedeem = async () => {
    try {
      if(!user) {
        alert('Please login to redeem items.');
        return;
      }
      const cartItem = {
        user: user.user,
        item_name: item.item_name,
        item_img: item.item_img,
        item_points: item.item_points,
        quantity: 1 // force quantity to 1
      };
      console.log("🎁 Redeeming item:", cartItem);
      const response = await axios.post('http://localhost:5000/cart/add', cartItem);
      if (response.status === 200) {
        alert('Item redeemed and added to cart!');
        navigate('/Cart'); // Redirect to cart page after redeeming
      } else {
        alert('Failed to redeem item. Please try again.');
      }
    }catch (error) {
      console.error('Error redeeming item:', error);
      alert('An error occurred while redeeming the item. Please try again.');
    }
  };

  // Function to convert Google Drive view URL to direct image link
  const getGoogleDriveImageUrl = (url) => {
    try {
      const regex = /\/d\/([a-zA-Z0-9_-]+)/;
      const match = url.match(regex);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
      return url; // fallback if pattern doesn't match
    } catch (e) {
      console.error('Invalid image URL:', url);
      return url;
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/item/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id]);
  if (!item) {
    return <div>Loading item details...</div>; // or some loading indicator
  }

  const imageUrl = getGoogleDriveImageUrl(item.item_img);
  console.log('Resolved Image URL:', imageUrl);

  return (
    <div className='VoucherContainer'>
      <div className='HeaderVoucher'>
        <img src={OptLogo} alt="" className='Opt1'/>
      </div>
      <NavBar/>
      <div>
        <div className="VouBackC">
          <button className="btnBackC" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="voucherTitle">Voucher Details</h1>
        </div>
        {/*Voucher Display*/}
        <div className='Box'>
          <div className='voucherContain'>
            <div className='divImg'>
              <img src={imageUrl} alt={item.item_name} className='voucherImage' />
            </div>
            <div className='divDetail'>
              <h1 className='divTitle'>{item.item_name}</h1>
              <p className='divContent'>{item.item_desc1}</p>
              <p className='divContent'>{item.item_desc2}</p>
              <p className='divContent'>Points Required: {item.item_points} pts</p>
              <p className='divContentTC' onClick={handleShowTC}>T&C Apply</p>
              {showTC && (
                <div className="modal-overlay" onClick={handleCloseTC}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Terms & Conditions</h2>
                    <p>
                      This voucher is valid for one-time use only. It is non-transferable and cannot be exchanged for cash.
                      The company reserves the right to change or cancel the offer at any time without prior notice.
                      Usage of this voucher constitutes acceptance of these terms.
                    </p>
                    <button className="modal-close" onClick={handleCloseTC}>Close</button>
                  </div>
                </div>
              )}
              <div className='actionRow'>
                <div className='quantitySelect'>
                  <p>Quantity:</p>
                  <button className='quanBtn' onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}>-</button>
                  <span className='quan'>{quantity}</span>
                  <button className='quanBtn' onClick={() => setQuantity(prev => Math.max(prev + 1, 1))}>+</button>
                </div>
                <div className='btnGroup'>
                  <button className='cartBtn' onClick={handleAddToCart}>Add to Cart</button>
                  <button className='redeBtn' onClick={handleRedeem}>Redeem</button>
                </div>
              </div>
            </div>
          </div>
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

export default detvou
