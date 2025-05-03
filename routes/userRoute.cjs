const express = require('express');
const router = express.Router();
const UserData = require('../models/userModel.cjs');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const crypto = require('crypto');
require('dotenv').config({ path: './cred.env' });

//Register Route
router.post('/register', async (req, res) => {
    try{
        const {user, email, phone, address, about, pass1, points} = req.body;

        //Check if user already exist
        const existUser = await UserData.findOne({ user });
        const existEmail = await UserData.findOne({ email });

        if (existUser && existEmail) {
          return res.status(400).json({ message: 'Username and email already exist' });
        }
        if (existUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
        if (existEmail) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        
        const newUserData = new UserData({
            user,
            email,
            phone,
            address,
            about,
            password: pass1,
            points
        });
        
        await newUserData.save();
        console.log('User saved: ',newUserData);
        res.status(201).json({ message: 'User registered successfully!' });
    }catch(err){
        console.log('Error Saving User: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Google Login Route
router.post('/google-login', async (req, res) => {
  try {
    const { user, email, image } = req.body;
    // Check if user already exists
    let existUser = await UserData.findOne({ email });
    if (!existUser) {
      // Create new user with 500 points
      const newUser = new UserData({
        user,
        email,
        phone: 'N/A', // <- update this
        address: 'N/A', // <- update this
        about: '', // can stay empty if not required
        password: 'google-auth', // <- some dummy non-empty password (you won’t use it)
        image,
        points: 500, // <- default points
        verificationCode: '', // <- optional, can be empty
      });
      await newUser.save();
      existUser = newUser;
    }
    // Return user data
    return res.status(200).json({
      message: 'Google login successful',
      user: {user: existUser.user,
        email: existUser.email,
        phone: existUser.phone,
        address: existUser.address,
        about: existUser.about,
        image: existUser.image,
        points: existUser.points,
        profileImage: existUser.image,
      }
    });
  } catch (err) {
    console.error('Error during Google login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Login Route
router.post('/login', async (req, res) => {
    try{
        const {user, password} = req.body
        //check username
        const existUser = await UserData.findOne({user});
        if(!existUser){
          return res.status(404).json({ message: 'User not found!' });
        }
        //check password
        if(existUser.password !== password){
          return res.status(401).json({ message: 'Incorrect password!' });
        }
        // Send user data back in response
        return res.status(200).json({
          message: 'User Logged In Successfully',
          user: {
            user: existUser.user,
            email: existUser.email,
            phone: existUser.phone,
            address: existUser.address,
            about: existUser.about,
            image: existUser.image,
            points: existUser.points,
            profileImage: existUser.image
          }
        });
    }catch(err){
        console.log('Error Logging In: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Forgot Password Route
router.post('/verify', async (req, res) => {
	try{
		const{user, email, newPassword} = req.body;

		//Check if user and email match
		const existUser = await UserData.findOne({user,email});
		if(!existUser){
			return res.status(400).json({message: 'User and Email do not match!'});
		}

		existUser.password = newPassword;
    await existUser.save();

		res.status(200).json({message:'Password changed successfully!'});
	}catch(err){
		console.log('Error in forgor password: ',err);
		res.status(500).json({error: 'Internal Server Erro'});
	}
});

//OAuth2 Route
const { OAuth2Client } = require('google-auth-library');
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
oAuth2Client.getAccessToken()
.then(res => {
  console.log('✅ Access token obtained:', res.token);
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  gmail.users.getProfile({ userId: 'me' }, (err, res) => {
    if (err) {
      console.error('❌ Gmail API error:', err);
    } else {
      console.log('✅ Gmail profile fetched:', res.data);
    }
  });
})
.catch(err => {
  console.error('❌ Error getting access token:', err);
});
async function sendVerificationEmail(email, verificationCode) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    const mailOptions = {
      from: 'OPTIMA BANK',
      to: email,
      subject: 'Optima Bank - Password Reset Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
// Forgot Password Route - Step 1
router.post('/send-code', async (req, res) => {
  const { user, email } = req.body;
  try {
    // Check if user exists with the provided email
    const existUser = await UserData.findOne({ user, email });
    if (!existUser) {
      return res.status(400).json({ message: 'User and email do not match!' });
    }
    // Generate a random verification code
    const verificationCode = crypto.randomBytes(3).toString('hex'); // 6-digit code

    // Save the verification code to the database
    existUser.verificationCode = verificationCode;
    await existUser.save();

    // Send the verification code to the user's email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent to your email!' });
  } catch (error) {
    console.error('Error sending code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Verify the Code - Step 2
router.post('/verify-code', async (req, res) => {
  const { user, code } = req.body;
  try {
    const existUser = await UserData.findOne({ user });
    if (!existUser || existUser.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Reset Password - Step 3
router.post('/reset-password', async (req, res) => {
  const { user, newPassword } = req.body;
  try {
    const existUser = await UserData.findOne({ user });
    if (!existUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    existUser.password = newPassword;
    await existUser.save();

    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Fetch User Data Route
router.get('/profile/:username', async(req, res) => {
  try{
    const {username} = req.params;
    const userData =await UserData.findOne({user: username});

    if(!userData) {
      return res.status(404).json({message: 'User not found!'});
    }
    const {password, __v, _id, ...safeData} = userData.toObject(); // Hide sensitive data
    res.json(safeData);
  }catch(err){
    console.log('Error fetching user data: ', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});
router.get('/image/:username', async(req, res) => {
  try{
    const {username} = req.params;
    const userData =await UserData.findOne({user: username});
    if(!userData) {
      return res.status(404).json({message: 'User not found!'});
    }
    res.json({ image: user.image });
  }catch(err){
    console.log('Error fetching user image: ', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

//Update Profile Route
router.put('/update', async (req, res) => {
  try{
    const { originalUser, newUser, email, phone, address, about, image } = req.body;
    if (originalUser !== newUser) {
      const existingUser = await UserData.findOne({ user: newUser });
      if (existingUser) {
        return res.status(400).json({ message: 'New username already exists' });
      }
    }
    const updated = await UserData.findOneAndUpdate(
      { user: originalUser },
      { user: newUser, email, phone, address, about, image },
      { new: true } // Return the updated document
    );
    if (!updated) {
      return res.status(404).json({ message: 'User not found!' });
    }
    res.status(200).json({ message: 'Profile updated successfully!' });
  }catch(err){
    console.log('Error updating profile: ', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
});

// Update Points Route
router.put('/update-points', async (req, res) => {
  const { user, newPoints } = req.body;
  try {
    const existUser = await UserData.findOne({ user });
    if (!existUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    existUser.points = newPoints;
    await existUser.save();
    res.status(200).json({ message: 'Points updated successfully' });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;