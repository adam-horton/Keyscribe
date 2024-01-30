import { Router } from 'express';
import { loginHandler, registerHandler } from '../handlers/login-handler';
import { userInfoHandler } from '../handlers/user-handler';
import { ledOn } from '../handlers/led-handler';
import { claimKeyboard, authorizeKeyboard } from '../handlers/keyboard-handler';
import { authenticate, isAuthenticated } from './middleware';

const router = Router();

router.post('/login', authenticate, loginHandler);
router.post('/register', registerHandler);
router.post('/led', ledOn);
router.post('/claim', claimKeyboard); // WARNING! DOES NOT WORK YET
router.get('/authorize', authorizeKeyboard);
router.get('/getUserInfo', isAuthenticated, userInfoHandler);
router.get('/userLoggedIn', isAuthenticated);

export default router;
