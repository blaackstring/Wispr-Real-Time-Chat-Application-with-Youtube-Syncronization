import express from "express";
import { login, logout, signup } from "../Controller/authController.js";
import fileUpload from "../Controller/cloudiniryController.js";
import multer from "multer";
import authMiddleware from "../middlewares/authMiddleware.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' directory exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log(file, 'shahan');
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/logout', logout);

// Make sure authentication runs before file upload
router.post("/uploadfile", authMiddleware, upload.single('profilepic'), fileUpload);

export default router;
