const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.signup = async (req,res) => {
try {
    const {name, role, email, password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success: false,
            message: "User Already Exist."
        }) 
    }
    let hashPassword;
    try{
        hashPassword = await bcrypt.hash(password, 10)
    }
    catch(err){
       return res.status(500).json({
            success: false,
            message: "Error in hashing password"
        })
    }

    const user= await User.create({
        name, email, password, hashPassword, role
    })

    res.status(200).json({
        success: true,
        message: "user created successfully"
    })

} catch (error) {
    console.log(error)
   return res.status(500).json({
        success: false,
        message: "user cannot be registered please try again later..."
    })
}
}


exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;

        // validation check for null 
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "fill correct info"
        })

        }

        let user = await User.findOne({email})
        // if user is not registered
         if(!user){
          return res.status(401).json({
            success: false,
            message: "User is not registered."
          })
         }
         // compare password and generation of jwt token
         const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
           
         }
         if(bcrypt.compare(password,user.password)){
            
             let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
             } )
             user = user.toObject()
             user.token = token;
             user.password = undefined; // ye humne database se nhi hataya hai jo humne user ka object nikala hai usame se hataya hai
             const options ={
               expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
               httpOnly : true,


             }
             res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message:"User Logged in successfully."
             })
            
         }

         else{
            return res.status(403).json({
        
                success: false,
                message: "Password Doesnot match "
            })
         }
        
    } catch (error) {
        console.log(error)
       return res.status(500).json({
            success: false,
            message: "user cannot login to the application"
        })
    }
    }