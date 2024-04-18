import { Router } from 'express';
import { helloWorld, helloWorld2 } from '../handlers/test-handler';

const router = Router();

router.get('/test', helloWorld);

router.get('/test2', helloWorld2);

export default router;
