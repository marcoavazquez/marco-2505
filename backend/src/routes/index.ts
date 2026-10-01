import { Router } from 'express';
import snailpayRouter from './snailpay.routes.ts';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.use('/snailpay', snailpayRouter);

export default router;