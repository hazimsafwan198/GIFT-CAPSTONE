import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import OptLogo from '../../assets/logo3.png'
import item1 from '../../assets/Item/Kurma.png'
import item2 from '../../assets/Item/Pizza.png'
import item3 from '../../assets/Item/NoseTrim.png'
import item4 from '../../assets/Item/ToteBag.png'
import './life.css'

const life = () => {
  const navigate = useNavigate();
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Array of items
  const items = [
    { 
      id: 31,
      title: 'Kurma Set',
      image: item1, points: 300,
      description1: 'Treat yourself or a loved one with a premium Kurma set.',
      description2: 'Redeem your voucher now and enjoy the natural goodness of handpicked dates.'},
    { 
      id: 32,
      title: 'Pizza Hut Voucher',
      image: item2, points: 250,
      description1: 'Enjoy a delicious pizza with exclusive savings at Pizza Hut!',
      description2: 'Redeem your voucher now to get irresistible deals on your next order.'},
    { 
      id: 33, 
      title: 'Hair Trimmer Set', 
      image: item3, points: 400, 
      description1: 'Stay sharp and well-groomed with high-precision trimmer.',
      description2: 'Redeem your voucher now for effort-less personal care and hygiene.'},
    { 
      id: 34,
      title: 'Tote Bag Voucher',
      image: item4, points: 200,
      description1: 'Get a stylish, eco-friendly tote bag perfect for everyday use.',
      description2: 'Redeem your voucher now and carry your essentials things with flair.'},
    // Add more items as needed
  ];

  // Filtered items based on search query
  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='LifeContainer'>
      <div className='HeaderLife'>
        <img src={OptLogo} alt="" className='Opt1'/>
      </div>
      <NavBar/>
      <div>
        <div className="LifeBackC">
          <button className="btnBackC" onClick={() => navigate('/Home')}>← Back</button>
          <h1 className="lifeTitle">LIFESTYLES REWARD VOUCHERS</h1>
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
        <div className='lifeContent'>
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

export default life