import { Router } from 'express';
import { SnailPayController } from '../controllers/snailpay.controller.ts';

const router = Router();

router.post('/pay', SnailPayController.pay);

export default router;