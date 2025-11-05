import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import configsRoute from './routes/configs.route.js';
import statusRoute from './routes/status.route.js';
import logsRoute from './routes/logs.route.js';

const app = express();

/** ===== CORS: allowlist + vercel preview/prod ===== */
const allowlist = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://webappassignmentfrontend.vercel.app', // ไม่มี slash ท้าย
];
const vercelHostRegex = /\.vercel\.app$/;

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // ถ้าจะใช้ cookie ค่อยเปลี่ยนเป็น true + ตั้งค่า cookie ให้ถูก
}));

// ถ้าต้องการคง preflight handler ไว้ ให้ใช้ pattern ใหม่ แทน '*'
// (หรือลบบรรทัดนี้ทิ้งก็ได้ เพราะ middleware cors() จัดการ preflight ให้อยู่แล้ว)

/** ===== Security & parsing ===== */
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // ปรับตามต้องการ ถ้าเปิดจริงต้อง whitelist โดเมน static ให้ครบ
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
