require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../modals/usermodal');


let otpStorage = {}; 

router.post('/send-otp', async (req, res) => {
  let Success = false;
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); 
    otpStorage[email] = otp;

  const transporter =  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Verify Your Account Using this OTP !! ${otp}
    Thanks & Regards!!!
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    Success = true;
    res.status(200).json({Succes : Success, message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
});

router.post('/verify-otp/:id', async (req, res) => {
  try {
    let Success = false;
    const userId = req.params.id;
    const { email, otp } = req.body;

    if (otpStorage[email] == otp) {
      delete otpStorage[email]; 
      Success = true;

      // ✅ Use async/await instead of callback
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { Verified: true },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        Succes: Success,
        message: 'OTP verified successfully!',
        user: updatedUser
      });
    } else {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ error: 'Error updating user verification status' });
  }
});




const OtpVerifyFunction = (otp,email) => {
  let Success = false;
  if (otpStorage[email] == otp) {
    delete otpStorage[email]; 
    Success = true;
    return true;
  } else {
    return false;
  }
};


module.exports =  { router,OtpVerifyFunction };