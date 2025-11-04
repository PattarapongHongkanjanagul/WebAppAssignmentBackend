import { Router } from 'express';
const router = Router();

// TODO: ภายหลังจะเรียก Server1 แล้วคืนเฉพาะ { condition }
router.get('/:droneId', async (req, res) => {
    res.json({ message: 'status placeholder', id: req.params.droneId });
});

export default router;
