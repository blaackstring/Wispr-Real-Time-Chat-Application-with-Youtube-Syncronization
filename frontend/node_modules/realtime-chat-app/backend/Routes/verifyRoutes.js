// server/routes/auth.js
import express from "express";
import authMiddleware from '../middlewares/authMiddleware.js'

const Verifyrouter = express.Router();

Verifyrouter.get("/verifyuser", authMiddleware, (req, res) => {
 try{

    res.json({ user: req.user });
     // Send the authenticated user
 }
 catch(error){
    res.status(500).json({ message: "error while verifying user"});
 }  // Return 500 if error occurred during request
});

export default Verifyrouter;
