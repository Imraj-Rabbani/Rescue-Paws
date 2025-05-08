import express from "express";
import cors from "cors";
import "dotenv/config"
import cookieParser from "cookie-parser";

import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";

import uploadRouter from "./routes/uploadRoutes.js";

import productRouter from './routes/productRoutes.js';
import volunteerRouter from './routes/volunteerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import inviteRoutes from './routes/inviteRoutes.js';

const app = express()

const port = process.env.PORT || 4000
connectDB()

const allowedOrigins = ['http://localhost:5173']

// Increase the limit for JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser())
app.use(cors({origin: allowedOrigins ,credentials: true}))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



//API Endpoints
app.get('/', (req, res )=> res.send("API Working"))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/upload', uploadRouter)

app.use('/api/products', productRouter);
app.use('/api/volunteers', volunteerRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/teams', teamRouter);
app.use('/api', inviteRoutes);


app.listen(port, () => console.log(`Server started on PORT: ${port}`))