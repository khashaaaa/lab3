import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

router.use('/users', userRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default router;