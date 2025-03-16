import express from "express";  
import { getAllUsers, getRecentUsers } from "../Controller/getAllUsers.js";
import authMiddleware from "../middlewares/authMiddleware.js";



const UserRouter=express.Router();

UserRouter.get('/users',authMiddleware,getAllUsers);
UserRouter.get('/recentUsers',authMiddleware,getRecentUsers);




export default UserRouter;