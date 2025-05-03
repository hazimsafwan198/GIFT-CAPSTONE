import React, {useState} from 'react'
import axios from 'axios'
import './reg.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo2.png'

const reg = () => {
  const [input, setInput] = useState({
    user: '',
    email: '',
    phone: '',
    address: '',
    pass1: '',
    pass2: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleChange(event){
    const {name, value} = event.target;
    setInput(prevInput =>{
      return {
        ...prevInput,
        [name]: value
      }
    })
  }
  async function handleClick(event){
    event.preventDefault();

    //Check if any field is empty, use trim to ignore white spaces
    if(Object.values(input).some(value => !value.trim() )){
      alert('Please fill all the fields');
      return;
    }
    //Simple password validation
    if(input.pass1 !== input.pass2){
      setError('Passwords do not match');
      return;
    }

    const newUserData = {
      user: input.user,
      email: input.email,
      phone: input.phone,
      address: input.address,
      about: '',
      image: '',
      pass1: input.pass1,
      points: 50000
    };

    try{
      const response = await axios.post('http://localhost:5000/user/register', newUserData);
      alert(`Registration Successful! You have received 500 points.`);
      navigate('/Login');
      setError('');
    }catch(err){
      console.error('Error during registration:', err);
      
      if (err.response && err.response.status === 400) {
        alert(`Registration Failed: ${err.response.data.message}`);
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  }
  return (
    <div className='containerReg'>
      <img src={logo} alt="" className='logo2'/>
      <label className='titleReg1'>Create Your Account</label>
      <label className='titleReg2'>Already Have an Account?<Link to='/Login'className='LogLink'>Sign in Here</Link></label>
      <form>
        <div className='form-group'>
          <input onChange={handleChange} className='form-control' name='user' value={input.user} type='text'placeholder='Enter your Username'/>
        </div>
        <div className='form-group'>
          <input onChange={handleChange} className='form-control' name='email' value={input.email} type='email' placeholder='Enter your Email'/>
        </div>
        <div className='form-group'>
          <input onChange={handleChange} className='form-control' name='phone' value={input.phone} type='text'placeholder='Enter your Phone Number'/>
        </div>
        <div className='form-group'>
          <input onChange={handleChange} className='form-control' name='address' value={input.address} type='text'placeholder='Enter your Address'/>
        </div>
        <div className='form-group'>
          <input onChange={handleChange} className='form-control' name='pass1' value={input.pass1} type= 'password' placeholder='Enter Your Password'/>
        </div>
        <div className='form-group'>
          <input onChange={handleChange} className='form-control' name='pass2' value={input.pass2} type='password' placeholder='Enter Your Password Again'/>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        <button onClick={handleClick} className='btnReg' type='submit'>Register ➜</button>
      </form>
    </div>
  )
}

export default reg