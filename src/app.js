import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import configsRoute from './routes/configs.route.js';
import statusRoute from './routes/status.route.js';
import logsRoute from './routes/logs.route.js';

const app = express();

app.use(helmet());
app.use(cors());
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
app.listen(PORT, () => {
    console.log(`drone-api listening on port ${PORT}`);
});
