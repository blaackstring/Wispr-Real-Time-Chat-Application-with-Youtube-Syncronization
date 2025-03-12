import user from "../models/user.model.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs";

dotenv.config();


 export const signup=async(req,res)=>{
    try {
        const {email,password,fullname,gender,username}=req.body;
        let ProfilePic;
        gender==='male'?ProfilePic='https://avatar.iran.liara.run/public/boy':ProfilePic='https://avatar.iran.liara.run/public/girl';
        const isUserExist= await user.findOne({email,username})
       if(isUserExist) return res.status(200).json({message:"User already exists"});


       const hashPassword =await bcryptjs.hash(password,10);
       
       const newUser=new user({
        fullname,
        username,
        gender,
        email,
        ProfilePic,
        password:hashPassword
       });

       await newUser.save();  // save user to database

       res.status(201).send({
        success:true,
         message:"User registration successful",
         user:{
             id:newUser._id,
             fullname:newUser.fullname,
             username:newUser.username,
             email:newUser.email,
             profilePic:newUser.ProfilePic,
             gender:newUser.gender
         }
 
       });
    } catch (error) {
      
        
        res.status(500).json({
            success: false,
            message:"User registration failed"
        });
            console.log(error)
    }
}





 export const login=async(req,res)=>{
try {
    const {email,password}=req.body;
    const User=await user.findOne({email  }); //it returns a promise object
    if(!User) return res.status(400).json({message:"User not Found or email is not valid"});

     const ispasswordmatch=await bcryptjs.compare(password,User.password || " ");

     if(!ispasswordmatch) return res.status(400).json({message:"Invalid password"});
    
//jwt token gen
     const token = jwt.sign({id: User._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
     res.cookie("token", token, {
        httpOnly: true, // Prevent JavaScript access (security best practice)
        secure: true, // Required for SameSite: "None" to work
        sameSite: "strict", // Allows cross-site cookies
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires in 1 day
      });


     res.status(201).send({
        success:true,
        message:"User Login successful",
        user:{
            id:User._id,
            fullname:User.fullname,
            username:User.username,
            email:User.email,
            ProfilePic:User.ProfilePic,
            gender:User.gender
        }

      });

} catch (error) {

        
    res.status(500).json({
        success: false,
        message:"User registration failed"
    });
        console.log(error)
}
}

export const logout=(req,res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,  // Set `true` in production (HTTPS required)
        sameSite: "strict",
      });
      res.json({ message: "Logged out successfully" });
}


export default {signup,login,logout};
