import express, { Router } from  "express";
import {login ,logout,signup} from "../Controller/authController.js"
import fileUpload from "../Controller/cloudiniryController.js";
import multer from "multer";
import authMiddleware from "../middlewares/authMiddleware.js";

const router=express.Router();

//multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Store files in 'uploads' directory
    },
    filename: (req, file, cb) => {
      console.log(file,'shahan')
      cb(null, `${req.fieldname}-${Date.now()}`); // Rename file with timestamp
    }
  });
  
  const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 50 * 1024 * 1024 } // Optional size limit
});

router.post("/signup",signup);
router.post("/login",login);
router.get('/logout',logout)
router.post("/uploadfile",upload.single('profilepic'),authMiddleware,fileUpload);

export default router;
