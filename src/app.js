import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import configsRoute from './routes/configs.route.js';
import statusRoute from './routes/status.route.js';
import logsRoute from './routes/logs.route.js';

const app = express();


app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://webappassignmentfrontend.vercel.app/','https://webappassignmentbackend.onrender.com/configs/3001'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

// ...


app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
}));
app.use(express.json());

// healthcheck
app.get('/', (req, res) => {
    res.json({ ok: true, service: 'drone-api' });
});

// mount routes (เราจะค่อยๆ เติมในขั้นถัดไป)
app.use('/configs', configsRoute);
app.use('/status', statusRoute);
app.use('/logs', logsRoute);

const PORT = process.env.PORT || 3000;
// 👇 ให้ฟังที่ทุกอินเทอร์เฟซ (กันเคสบางเครื่อง bind แค่ ::1/IPv6)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`drone-api listening on port ${PORT}`);
});
