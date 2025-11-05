import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import configsRoute from './routes/configs.route.js';
import statusRoute from './routes/status.route.js';
import logsRoute from './routes/logs.route.js';

const app = express();

/** ===== CORS setup (แก้จุดสำคัญ) ===== */
const allowlist = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://webappassignmentfrontend.vercel.app', // ไม่มี slash ท้าย
];
// อนุญาตโดเมน Vercel ทุก preview/prod ของโปรเจกต์นี้
const vercelHostRegex = /\.vercel\.app$/;

app.use(cors({
  origin(origin, cb) {
    // อนุญาตเครื่องมือทดสอบ/healthcheck ที่ไม่มี origin (เช่น curl, Postman)
    if (!origin) return cb(null, true);

    let allowed = false;
    try {
      const url = new URL(origin);
      // อยู่ใน allowlist แบบตรงตัว หรือ โฮสต์ลงท้ายด้วย .vercel.app
      allowed = allowlist.includes(origin) || vercelHostRegex.test(url.host);
    } catch {
      // ถ้า origin แปลก ๆ
      allowed = false;
    }

    if (allowed) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // ถ้าอนาคตจะใช้ cookie ให้เปลี่ยนเป็น true + ตั้ง SameSite=None; Secure ฝั่ง cookie
}));

// รองรับ preflight ทุกเส้นทาง
app.options('*', cors());

/** ===== Security & body ===== */
app.use(helmet({
  crossOriginResourcePolicy: false,   // ให้โหลด resource ข้ามโดเมนได้
  contentSecurityPolicy: false        // ปิด CSP ถ้า frontend host อื่น (ปรับตามต้องการ)
}));
app.use(express.json());

/** ===== Healthcheck ===== */
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'drone-api' });
});

/** ===== API Routes ===== */
app.use('/configs', configsRoute);
app.use('/status', statusRoute);
app.use('/logs', logsRoute);

/** ===== Start server ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`drone-api listening on port ${PORT}`);
});
