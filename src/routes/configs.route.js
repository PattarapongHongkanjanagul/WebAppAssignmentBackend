import { Router } from 'express';
const router = Router();

// TODO: ภายหลังจะเรียก Server1 แล้ว map field ตามสเปก
router.get('/:droneId', async (req, res) => {
    res.json({ message: 'configs placeholder', id: req.params.droneId });
});

export default router;


