import express from 'express';
import DbConnect from './db/DbConnect.js';
import cookieParser from 'cookie-parser';
import router from './Routes/AuthRoutes.js';
import cors from "cors";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import messageroute from './Routes/messageRoutes.js';
import UserRouter from './Routes/userRoutes.js';
import Verifyrouter from './Routes/verifyRoutes.js';
import {  server, app } from './Socket.io/Socket.js';
import sendUrlRoute from './Routes/sendUrlRoute.js';
import path from 'path';

dotenv.config({ path: '../.env' });

const AuthRoutes = router;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()); 

// CORS Configuration
app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Database Connection
DbConnect().then(() => {
    console.log("✅ Database connected successfully");

    // API Routes
    app.use("/api/auth", AuthRoutes);
    app.use('/api/messages', messageroute);
    app.use('/api/search', UserRouter);
    app.use('/api/verify', Verifyrouter);
    app.use('/api/watchparty', sendUrlRoute);

    // Serve Frontend (Move this to the bottom)
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "public")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    // Start Server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

}).catch(err => {
    console.error("❌ Database connection failed:", err);
});
