import { Router } from 'express';
import { loginHandler, registerHandler, logoutHandler } from '../handlers/login-handler';
import {
  claimKeyboard,
  authorizeKeyboard,
  createSessionHandler,
  joinSesssionHandler,
  closeSessionHandler,
  leaveSessionHandler,
  getKeyboardsHandler,
  getActiveHandler,
  setActiveHandler,
  getSessionHandler,
} from '../handlers/keyboard-handler';
import { userInfoHandler, addFriend } from '../handlers/user-handler';
import { authenticate, isAuthenticated, boardOwnershipCheck } from './middleware';

const router = Router();

// KEYBOARD API
router.get('/authorize', authorizeKeyboard);

// LOGIN/LOGOUT
router.post('/login', authenticate, loginHandler);
router.delete('/logout', isAuthenticated, logoutHandler);

// USER API
router.post('/register', registerHandler);
router.get('/getUserInfo', isAuthenticated, userInfoHandler);
router.post('/friend', addFriend); // DOES NOT WORK YET
router.get('/userLoggedIn', isAuthenticated);

// KEYBOARD API
router.get('/getKeyboards', isAuthenticated, getKeyboardsHandler);
router.get('/getActiveKeyboard', isAuthenticated, getActiveHandler);
router.get('/getSessionId/:boardId', isAuthenticated, boardOwnershipCheck, getSessionHandler);
router.post('/setActiveKeyboard/:boardId', isAuthenticated, boardOwnershipCheck, setActiveHandler);
router.post('/claim', isAuthenticated, claimKeyboard);
router.post('/session/create/:boardId', isAuthenticated, boardOwnershipCheck, createSessionHandler);
router.post('/session/join/:boardId', isAuthenticated, boardOwnershipCheck, joinSesssionHandler);
router.delete('/session/leave/:boardId', isAuthenticated, boardOwnershipCheck, leaveSessionHandler);
router.delete('/session/close', isAuthenticated, closeSessionHandler);

// FOR TESTING
router.get('/ping', (req, res) => {
  console.log('Ping Reached!');
  return res.status(200).send(
    { message: 'reached' },
  );
});

export default router;
