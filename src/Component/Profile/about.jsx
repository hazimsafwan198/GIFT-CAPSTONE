import React, { useEffect, useState } from 'react'
import axios from 'axios'
import NavBar from '../NavBar/NavBar'
import OptLogo from '../../assets/logo3.png'
import ProfLogo from '../../assets/profile1.png'
import './about.css'

const about = () => {
  const [user, setUser] = useState('');
  const [originalUser, setOriginalUser] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [about, setAbout] = useState('');
  const [points, setPoints] = useState(0);
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData.user);
      setOriginalUser(userData.user);
      setEmail(userData.email);
      setPhone(userData.phone);
      setAddress(userData.address);
      setAbout(userData.about);
      setPoints(userData.points);

      if (userData.profileImage) {
        setPreviewImage(userData.profileImage);
        setPreviewImage(userData.profileImage); // Set the preview image to the stored image
      }
    }
  }, []);
  const handleSave = async () => {
    try{
      const response = await axios.put('http://localhost:5000/user/update', {
        originalUser,
        newUser: user,
        email:email,
        phone:phone,
        address:address,
        about:about,
        image: profileImage,
      });
      alert('Profile updated successfully!');

      //Updated Local
      const updatedUser = {...JSON.parse(localStorage.getItem('user')), user, email, phone, address, about, image: profileImage};
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setOriginalUser(user); // update tracking
      navigate('/Home');
    }catch(error){
      console.error('Error Updating Profile:', error);
      alert('Failed to update profile!');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
     reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 200, 200);

        const fileType = file.type; // 'image/jpeg', 'image/png', etc.
        const supportedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const mimeType = supportedTypes.includes(fileType) ? fileType : 'image/png';

        const resizedBase64 = canvas.toDataURL(mimeType);
        setImage(resizedBase64);
        setPreviewImage(resizedBase64);
        setProfileImage(resizedBase64); // Save the resized image to state
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='ProfContainer'>
      <div className='HeaderProf'>
        <img src={OptLogo} alt="" className='Opt1'/>
      </div>
      <NavBar/>
      <div className='aboutContent'>
        <h1 className='aboutTitle'>USER PROFILE</h1>
        <div className='profileBlock d-flex justify-content-center align-items-start gap-4 flex-wrap mx-auto'>
          {/* Profile Image & Edit */}
          <div className='text-center' style={{ flex: '0 0 auto' }}>
            <img src={previewImage || ProfLogo} alt='' className='ProfLogo mb-3'/>
            <input type="file" accept="image/*" onChange={handleImageChange} className='editProfImg'/>
          </div>
          {/* Profile Info Fields */}
          <div className='infofields' style={{ flex: '0 0 40%' }}>
            <input 
              type='text'
              className='form-control rounded-pill mb-3' 
              placeholder='Username'
              value={user}
              onChange={(e) => setUser(e.target.value)}/>
            <input 
              type='email' 
              className='form-control rounded-pill mb-3' 
              placeholder='Email'
              value={email} 
              onChange={(e) => setEmail(e.target.value)}/>
            <input 
              type='text' 
              className='form-control rounded-pill mb-3'
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder='Phone Number'/>
            <textarea 
              className='form-control rounded-4' 
              rows='3'
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Address'></textarea>
            <textarea 
              className='form-control rounded-4' 
              rows='5'
              value={about} 
              onChange={(e) => setAbout(e.target.value)}
              placeholder='About Me'></textarea>
          </div>
          {/* Points Balance */}
          <div className="text-center" style={{ flex: '0 0 auto' }}>
            <div className='border rounded-4 p-3'>
              <h5 className='mb-0'>POINTS BALANCE :</h5>
              <h4 className='fw-bold'>{points} PTS</h4>
            </div>
            <button className='btnAboutSave' onClick={handleSave}>SAVE</button>
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

export default about