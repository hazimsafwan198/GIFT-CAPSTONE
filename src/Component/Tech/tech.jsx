import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import OptLogo from '../../assets/logo3.png'
import item1 from '../../assets/Item/Laptop.png'
import item2 from '../../assets/Item/GooglePlay.png'
import item3 from '../../assets/Item/HeadPhone.png'
import item4 from '../../assets/Item/Steam.png'
import './tech.css'

const tech = () => {
  const navigate = useNavigate();
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Array of items
  const items = [
    { 
      id: 21,
      title: 'Asus Laptop Voucher',
      image: item1, points: 5000,
      description1: 'Upgrade your productivity with a reliable Asus laptop.',
      description2: 'Redeem this high value voucher now for yourself.'},
    { 
      id: 22,
      title: 'Google Play Coupon',
      image: item2, points: 300,
      description1: 'Explore millions of apps on the Play Store.',
      description2: 'Redeem this coupon and fuel your digital entertainment.'},
    { 
      id: 23, 
      title: 'Headphone Voucher', 
      image: item3, points: 800, 
      description1: 'Immerse yourself with clear sound quality headphones.',
      description2: 'Use this voucher for a gear to elevates your experience.'},
    { 
      id: 24,
      title: 'Steam Coupon',
      image: item4, points: 400,
      description1: 'Level up your gaming library with this Steam store coupon.',
      description2: 'Redeem and dive into endless adventures, action, and fun.'},
    // Add more items as needed
  ];

  // Filtered items based on search query
  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className='TechContainer'>
      <div className='HeaderTech'>
        <img src={OptLogo} alt="" className='Opt1'/>
      </div>
      <NavBar/>
      <div>
        <div className="TechBackC">
          <button className="btnBackC" onClick={() => navigate('/Home')}>← Back</button>
          <h1 className="techTitle">LIFESTYLES REWARD VOUCHERS</h1>
        </div>
        {/* Search Input */}
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Search for an item..."
            className="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='techContent'>
          {/* Map through filtered items */}
          {filteredItems.map(item => (
            <div className={`Box`} key={item.id}>
              <img src={item.image} alt={item.title} className="itemImg" />
              <div className="itemText">
                <h2 className="textTitle">{item.title}</h2>
                <h5 className="textContent">{item.description1}</h5>
                <h5 className="textContent">{item.description2}</h5>
                <h5 className="textPoint">Points Needed: {item.points} pts</h5>
              </div>
              <button className="itemBtn" onClick={()=> navigate(`/Voucher/${item.id}`)}>VIEW</button>
            </div>
          ))}
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

export default tech
