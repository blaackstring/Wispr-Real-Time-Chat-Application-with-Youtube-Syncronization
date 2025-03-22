import express, { Router } from  "express";
import {login ,logout,signup} from "../Controller/authController.js"
import fileUpload from "../Controller/cloudiniryController.js";
import multer from "multer";
import authMiddleware from "../middlewares/authMiddleware.js";

const router=express.Router();

//multer 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads'); // Ensures correct path
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log(file, 'shahan'); // Debugging
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
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
