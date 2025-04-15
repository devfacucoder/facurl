import express from 'express';
const app = express();
import mongoose from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import urlRouter from './routes/url.routes.js'; 
import userRouter from './routes/user.routes.js';

//
import createRoles from './libs/createRoles.js';
createRoles();
import fetch from 'node-fetch';

const logMyIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    console.log("🔍 IP pública del servidor:", data.ip);
  } catch (err) {
    console.error("Error obteniendo la IP:", err);
  }
};

logMyIP();
app.use(cors({
    origin: process.env.URL_fRONT,
    credentials: true // si estás usando cookies o cabeceras de autenticación
  }));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/", urlRouter);

export default app;
