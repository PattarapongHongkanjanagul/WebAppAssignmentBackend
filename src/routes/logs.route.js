import { Router } from 'express';
const router = Router();

// TODO: ภายหลังจะเรียก PocketBase (Server2) ทั้ง GET และ POST
router.get('/:droneId', async (req, res) => {
    res.json({ message: 'logs placeholder', id: req.params.droneId });
});

router.post('/', async (req, res) => {
    res.status(201).json({ message: 'create log placeholder', body: req.body });
});

export default router;
