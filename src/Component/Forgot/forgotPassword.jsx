import React, { useState } from 'react'
import axios from 'axios'
import './forgotPassword.css'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo2.png'

const forgotPassword = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [verificationCode, setVerificationCode] = useState('');

	//Input
	const [input,setInput] = useState({
		user: '',
		email: '',
		repass1: '',
		repass2: ''
	});
	//Error
	const [error, setError] = useState('');
	//Handle Changes
	const handleChange = (e) => {
		const {name, value} = e.target;
		setInput((prevInput) => ({
			...prevInput,
			[name]: value,
		}));
	};
	//Handle Return
	const handleReturn = () => {
		navigate('/Login');
	}
	//Handle Submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		const { user, email, repass1, repass2 } = input;

    if (!user || !email) {
      alert('Please fill in all fields');
      return;
    }

		try {
			if(step === 1){
				const res = await axios.post('http://localhost:5000/user/send-code', {user, email});
				alert('Verification code sent to your email!');
				setStep(2);
			}else if(step ===2){
				const res = await axios.post('http://localhost:5000/user/verify-code', {user, code: verificationCode});
				alert(res.data.message);
				setStep(3);
			}else if(step === 3){
				if(!repass1 || !repass2){
					alert('Please fill in new passwords');
					return;
				}
				if(repass1 !== repass2){
					setError('Passwords do not match!');
					return;
				}
				const res = await axios.post('http://localhost:5000/user/reset-password', {user, newPassword: repass1});
				alert(res.data.message);
				navigate('/Login');
			}
		}catch (err) {
			console.error(err);
			setError(err.response?.data?.message || 'An error occurred');
		}
	};

  return (
    <div className='containerForgot'>
        <img src={logo} alt="" className='logo2'/>
        <label className='titleForgot1'>Cant Remember Your Password?</label>
        <label className='titleForgot2'>Let Us Help You!</label>
        <form>
					{step === 1 && (
						<>
							<div className='form-group'>
									<input className='form-control' name='user' value={input.user} onChange={handleChange} type='text' placeholder='Enter your Username'/>
							</div>
							<div className='form-group'>
									<input className='form-control' name='email' value={input.email} onChange={handleChange} type='email' placeholder='Enter your Email'/>
							</div>
						</>
					)}
					{step >= 2 && (
						<div className='form-group'>
							<input 
								className='form-control' 
								name='verification' 
								value={verificationCode} 
								onChange={(e) => setVerificationCode(e.target.value)} 
								type='text' 
								placeholder='Enter your Verification code'/>
						</div>
					)}
					{step === 3 && (
						<>
							<div className='form-group'>
								<input className='form-control' name='repass1' value={input.repass1} onChange={handleChange} type='password' placeholder='Enter your New Password'/>
							</div>
							<div className='form-group'>
									<input className='form-control' name='repass2' value={input.repass2} onChange={handleChange} type='password' placeholder='Re Enter your New Password Again'/>
							</div>
						</>
					)}
					{error && <p style={{ color: 'red' }}>{error}</p>}
					<button onClick={handleSubmit} className='btnForgot' type='submit'>
						{step === 1 ? 'Get Verification Code': step === 2 ? 'Verify Code' : 'Submit'}
					</button>
					<button onClick={handleReturn} className='btnReturn' type='submit'>Return to Login</button>
        </form>
    </div>
  )
}

export default forgotPassword