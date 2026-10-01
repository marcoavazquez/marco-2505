import { Router } from 'express';
import { SnailPayController } from '../controllers/snailpay.controller.ts';
import { validate } from '../middlewares/validate.ts';
import { paymentSchema } from '../validators/snailpay.validator.ts';

const router = Router();

router.post('/pay', validate(paymentSchema), SnailPayController.pay);

export default router;