import React, { useState } from 'react'
import axios from 'axios'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo2.png'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const login = () => {
  const [user, setUser] = useState('');
  const [password, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    //Check if field are empty
    if(!user.trim() || !password.trim()){
      alert('Please fill all fields');
      return;
    }

    try{
      const response = await axios.post('http://localhost:5000/user/login',{
        user,
        password
      })
      {/*save to local storage*/}
      if (response.data && response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store the user data
        alert('Login Successful!');
        navigate('/Home');
      }else {
        console.error('User data not found in the response');
        window.alert('Login failed, user data not found');
      }
    }catch(error){
      console.error('Error:', error.response?.data || error.message);

       // Display specific error messages
      if (error.response) {
        if (error.response.status === 404) {
          window.alert('Username not found!');
        } else if (error.response.status === 401) {
          window.alert('Incorrect password!');
        } else {
          window.alert(error.response?.data?.message || 'An error occurred');
        }
      } else {
        window.alert('An error occurred, please try again later.');
      }
    }
  }

  return (
    <div className='containerLog'>
      <img src={logo} alt="" className='logo2'/>
      <label className='titleLog'>Login to Your Account</label>
      <form>
        <div className='form-group'>
          <input className='form-control' name='user' value={user} type='text' onChange={(e) => setUser(e.target.value)} placeholder='Enter your Username'/>
        </div>
        <div className='form-group'>
          <input className='form-control' name='pass' value={password}type= 'password' onChange={(e) => setPass(e.target.value)} placeholder='Enter Your Password'/>
        </div>
        <li className='RegForLink'>
            <Link to='/Register'className='regLink'>Register Now</Link>
            <Link to='/Forgot'className='forLink'>Forgot Password?</Link>
        </li>
        <div className="btn-container">
          <button onClick={handleLogin} className="btnLog" type="submit">
            Login ➜
          </button>

          <div className="google-login-container">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try{
                  const decoded = jwtDecode(credentialResponse.credential);
                  const email = decoded.email;
                  const name = email.split('@')[0]; // Extract username from email
                  const image = decoded.picture; // Get the image URL from the decoded token

                  const response = await axios.post('http://localhost:5000/user/google-login', {
                    user: name,
                    email: email,
                    image: image
                  });
                  if (response.data && response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    alert('Google Login Successful!');
                    navigate('/Home');
                  } else {
                    alert('Failed to log in with Google');
                  }
                } catch (err) {
                  console.error('Google login error:', err);
                  alert('Google login failed');
                }
              }}
              onError={() => console.log('Login Failed')}
              text="signin_with"
              shape="pill"
              width="400"
              theme="outline"
              size="large"
              logo_alignment="left"
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default login
