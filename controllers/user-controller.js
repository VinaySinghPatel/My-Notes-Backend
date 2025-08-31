const User = require("../modals/usermodal");
const express = require('express');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const middleware = require('../middleware/userauth');
const JWT_SECRET = "VinayPatel"
const jwt = require('jsonwebtoken');
const { OtpVerifyFunction  }= require('./EmailOtpVerify');

router.post('/createUser',[
body('name').notEmpty().withMessage('Username is required'),
  body('Email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password 8 Character ka Hona Chaiye.')
],async (req,res)=>{

 const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

        const {name,age,Email,password} = req.body;
        try{
            const existuser = await User.findOne({Email : Email});
            if(existuser){
                return res.status(400).json({error:"User Already Exists with this email"});
            }

            const salt = await bcrypt.genSalt(10);
            const newpass = await bcrypt.hash(password,salt);

         const   user = await new  User({
                Name:name,
                Age:age,
                Email:Email,
                Password: newpass
            });

           const userData =  await user.save();
            res.status(200).json({userData,message:"User Created Successfully"});
        }catch(err){
                res.status(500).json({err,error:"Internal Server Error"});
        }
});


router.post('/loginUser',async (req,res) => {
    try{
    const {Email,Password,otp} = req.body;
    const user = await User.findOne({Email:Email});
    if(!user){
        return res.status(400).json({error:"Please try to login with correct credentials"});
    }


    if(Password){
    const passCompare = await bcrypt.compare(Password,user.Password);
    if(!passCompare){
        return res.status(400).json({error:"Please try to login with correct credentials"});
    }
    const data = {
        user:{
            id:user.id
        }
    }
    const AuthToken = jwt.sign(data,JWT_SECRET);
    res.json({data,AuthToken});

    }else
        
        if(otp){
        let verify = OtpVerifyFunction(otp,Email);
        if(verify == true){
            const data = {
                user:{
                    id:user.id
                }
            }
            const AuthToken = jwt.sign(data,JWT_SECRET);
            res.json({data,AuthToken});
    }else{
        res.json({error:"Invalid OTP"});
        console.log("Invalid OTP");
    }
}

}catch(err){
    res.status(500).json({err,error:"Internal Server Error"});
    console.log(err);
}
});


router.patch('/updateUser/:id',middleware,async (req,res)=>{
    try{

    const id = req.params.id;

    const {Name,Age} = req.body;

    const newuser = {};

    if(Name){
        newuser.Name = Name;
    }
    if(Age){
        newuser.Age = Age;
    }

    let user = await User.findByIdAndUpdate(id,{$set:newuser},{new:true});

    res.status(200).json({user});
}catch(err){
    res.status(500).json({error:"Internal Server Error"});
}
})


router.get('/getUser/:id',middleware,async (req,res)=>{
    try {
        
    const id = req.params.id;
    let user = await User.findById(id).select('-Password');
    if(!user){
        res.status(404).json({error:"User Not Found"});
    }
    res.status(200).json({user});
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"});
        console.log(error);
    }
})



module.exports = router;