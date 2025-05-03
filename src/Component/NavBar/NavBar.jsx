//Navigation Bar
import React, { useState, useEffect } from 'react';
import './NavBar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import profileLogo from '../../assets/profile1.png'
import cart from '../../assets/cart1.png'
import axios from 'axios';

const NavBar = () => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
    setProfileDropdownOpen(false); // Close profile dropdown if open
  };
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setCategoryDropdownOpen(false); // Close category dropdown if open
  };

  //Fetch image
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if(userData){
          const response = await axios.get(`http://localhost:5000/user/profile/${userData.user}`);
          const image = response.data.image;
          setProfileImage(image || profileLogo);
        }
      }catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };
    fetchProfileImage();
  }, []);

  return (
    <nav className='containerNav'>
      <div className='SearchBar1'>
        <h5 className={`navLink ${location.pathname === '/Home' ? 'active' : ''}`}><Link to='/Home'>Home</Link></h5>
        <div className='categoryContainer'>
          <h5 className="navLink" onClick={toggleCategoryDropdown}>Categories</h5>
          {categoryDropdownOpen && (
            <div className={`categoryMenu open`}>
              <h5 className={`navLink ${location.pathname === '/Life' ? 'active' : ''}`}><Link to='/Life'>Lifestyles</Link></h5>
              <h5 className={`navLink ${location.pathname === '/Tech' ? 'active' : ''}`}><Link to='/Tech'>Technologies</Link></h5>
            </div>
          )}
        </div>
      </div>
      <div className='SearchBar2'>
        <p className='akbar'>Hello, {JSON.parse(localStorage.getItem('user'))?.user || 'User'}</p>
        <img src={cart} alt="" className='cartLogo' onClick={() => navigate('/Cart')}/>
        <div className='profileContainer'>
          <img src={profileImage || profileLogo} alt="" className='profLogo' onClick={toggleProfileDropdown}/>
          {profileDropdownOpen  && (
            <div className={`profileMenu open`}>
              <Link to='/Profile' className='profileItem'>Profile</Link>
              <Link to='/Login' className='profileItem'>Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar