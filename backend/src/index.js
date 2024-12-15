import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/users.route.js";
import messageRoutes from "./routes/messages.route.js";
import {connectDB} from "./lib/db.js";
import {app, server} from "./lib/socketio.js";

dotenv.config();

const port = process.env.PORT || 3000;
const __dirname = path.resolve();

const allowedOrigins = process.env.NODE_ENV === "development"
    ? ['http://localhost:5173', 'http://localhost:5173/']
    : ["https://fullstack-chat-app-99xq.onrender.com", "https://fullstack-chat-app-99xq.onrender.com/"];
const corsOptionsDelegate = function (req, callback) {
    const origin = req.header('Origin') || req.header('origin');
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, {
            origin: true,
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
        });
    } else {
        callback(new Error('Not Allowed by CORS'), {
            origin: false
        })
    }
}

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(cors(corsOptionsDelegate));
// app.options('*', cors(corsOptions)); // pre-flight

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // entrypoint for react application
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', './index.html'));
    })
}

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectDB();
})