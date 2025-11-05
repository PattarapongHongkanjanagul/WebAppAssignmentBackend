// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import configsRoute from './routes/configs.route.js';
import statusRoute from './routes/status.route.js';
import logsRoute from './routes/logs.route.js';

const app = express();

/**
 * อ่าน allowlist ของ frontend จาก ENV
 * ตัวอย่างบน Render:
 * FRONTEND_ORIGINS=https://your-frontend.vercel.app, http://localhost:5173
 */
const ALLOW = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// ตัวเลือก CORS (รองรับ preflight และ no-origin เช่น curl/Postman)
const corsOptions = {
  origin(origin, cb) {
    // อนุญาตคำขอที่ไม่มี Origin (เช่น curl, healthcheck)
    if (!origin) return cb(null, true);
    if (ALLOW.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400, // cache preflight 24 ชม.
};

// Security headers (ปิดบาง policy ที่กระทบ CORS/asset dev)
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ตอบ preflight ทุกเส้นทาง

app.use(express.json());

// healthcheck
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'drone-api', allowlist: ALLOW });
});

// routes
app.use('/configs', configsRoute);
app.use('/status', statusRoute);
app.use('/logs', logsRoute);

const PORT = process.env.PORT || 3000;
// ฟังทุกอินเทอร์เฟซ (ช่วยเวลา deploy บนคลาวด์)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`drone-api listening on port ${PORT}`);
  console.log('CORS allowlist:', ALLOW);
});
