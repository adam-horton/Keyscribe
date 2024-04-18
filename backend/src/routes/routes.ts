import { Router } from 'express';
import multer from 'multer';
import { loginHandler, registerHandler, logoutHandler } from '../handlers/login-handler';
import {
  claimKeyboardHandler,
  authorizeKeyboardHandler,
  createSessionHandler,
  joinSesssionHandler,
  closeSessionHandler,
  leaveSessionHandler,
  getKeyboardsHandler,
  getActiveHandler,
  setActiveHandler,
  getSessionHandler,
  startRecordingHandler,
  stopRecordingHandler,
  uploadRecordingHandler,
  getRecordingHandler,
  getRoleHandler,
} from '../handlers/keyboard-handler';
import { userInfoHandler, addFriend } from '../handlers/user-handler';
import { authenticate, isAuthenticated, boardOwnershipCheck } from './middleware';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// FOR USE BY KEYBOARDS ONLY!
router.get('/authorize', authorizeKeyboardHandler);
router.post('/recordingUpload', upload.single('midi_file'), uploadRecordingHandler);

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
router.get('/role/:boardId', isAuthenticated, boardOwnershipCheck, getRoleHandler);
router.get('/recording/:recordingId', isAuthenticated, getRecordingHandler);
router.post('/setActiveKeyboard/:boardId', isAuthenticated, boardOwnershipCheck, setActiveHandler);
router.post('/startRecording/:boardId', isAuthenticated, boardOwnershipCheck, startRecordingHandler);
router.post('/stopRecording/:boardId', isAuthenticated, boardOwnershipCheck, stopRecordingHandler);
router.post('/claim', isAuthenticated, claimKeyboardHandler);
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
