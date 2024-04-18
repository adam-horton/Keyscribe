import { Router } from 'express';
import { ledOn } from '../handlers/led-handler';

const router = Router();

router.post('/led', ledOn);

export default router;
