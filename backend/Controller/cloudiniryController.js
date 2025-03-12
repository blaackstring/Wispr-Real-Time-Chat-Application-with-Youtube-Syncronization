import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import fs from 'fs'
import user from '../models/user.model.js';
import {extractPublicId} from 'cloudinary-build-url'
    dotenv.config({ path: '../../.env' });

const fileUpload=async(req,res)=>{
try {
   const filepath=req.file.path;
   const uploadfile=await cloudinary.uploader.upload(filepath,{
    folder:'uploads'
   })

   try {
    fs.unlinkSync(filepath);
  } catch (unlinkError) {
    console.error("⚠️ Error deleting file:", unlinkError);
  }
const userdata= await user.findById(req.user._id);
if(userdata.ProfilePic){

    const publicId = extractPublicId(userdata.ProfilePic);
    console.log(publicId);
    
    cloudinary.uploader.destroy(publicId); // Delete the old profile picture from Cloudinary
  }
  
console.log(req.user._id);// userid save in request  by auth middleware
  const UserprofileUpdated=await user.findByIdAndUpdate(req.user._id,
    { ProfilePic: uploadfile.secure_url }, // Update the Profilepic field
    { new: true } // Return updated user
  )

  if(!UserprofileUpdated) {
    return res.status(404).json({ message: `${req.user._id}` });  // Return 404 if user not found
  }
   res.status(200).json({
    message: 'File uploaded successfully!',
    fileUrl: uploadfile.secure_url, // Cloudinary URL of the uploaded file
  });
    
} catch (error) {
    res.status(500).json({error:"Error  while uploading profile",error:error})
    console.log("Error while uploading profile",error);
}
}

export default fileUpload;