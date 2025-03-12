import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { sendmessage,recievemsg } from '../Controller/messageController.js';

const messageroute=express.Router();



messageroute.post('/send/:id',authMiddleware,sendmessage); //here id is reciver id and we use  path parameter here to know where to send the message
messageroute.get('/recieve/:id',authMiddleware,recievemsg); //here id is reciver id and we use path parameter)

export default messageroute;