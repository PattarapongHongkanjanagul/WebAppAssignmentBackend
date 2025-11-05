import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import configsRoute from './routes/configs.route.js';
import statusRoute from './routes/status.route.js';
import logsRoute from './routes/logs.route.js';

const app = express();

/** ===== CORS: allowlist + รองรับโดเมน Vercel (prod/preview) ===== */
const allowlist = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://webappassignmentfrontend.vercel.app', // ไม่มี slash ท้าย
];
const vercelHostRegex = /\.vercel\.app$/;

app.use(cors({
  origin(origin, cb) {
    // อนุญาตคำขอที่ไม่มี Origin (เช่น curl/Postman/healthcheck)
    if (!origin) return cb(null, true);

    let allowed = false;
    try {
      const u = new URL(origin);
      allowed = allowlist.includes(origin) || vercelHostRegex.test(u.host);
    } catch {
      allowed = false;
    }

    return allowed ? cb(null, true) : cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // ถ้าจะใช้ cookie/เซสชัน เปลี่ยนเป็น true และตั้งค่า cookie ให้ถูกต้อง
}));

// ไม่ต้องมี app.options('*', ...) เพราะ cors() จัดการ preflight ให้อยู่แล้ว

/** ===== Security & parsing ===== */
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // ถ้าจะเปิด CSP จริง ให้ whitelist โดเมน static ตามต้องการ
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
