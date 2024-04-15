import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import {
  validateHardwareId,
  getPID,
  getOwner,
  setOwner,
  createKeyboard,
  createSession,
  joinSession,
  leaveSession,
  closeSession,
  getKeyboards,
  getActiveKeyboard,
  setActiveKeyboard,
  getSessionId,
  startRecording,
  stopRecording,
  uploadFile,
  getRecording,
  getRole,
} from '../db/keyboard-db';
import { sendMessageToRaspberryPi } from '../websockets/websocket-setup';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const JWT_SECRET: string = process.env.JWT_SECRET!;

const authorizeKeyboardHandler = async (req: Request, res: Response) => {
  const hardwareIdString = req.query.hardwareId?.toString();
  if (hardwareIdString === undefined) {
    return res.status(400).send('Missing parameters');
  }
  const hardwareId = parseInt(hardwareIdString, 10);

  // Hardware ID is confirmed to be valid
  if (!await validateHardwareId(hardwareId)) {
    res.status(401);
    return res.send();
  }

  // If the keyboard is already registered, get its ID,
  // otherwise create a new keyboard in DB
  let pid = await getPID(hardwareId);
  let owner: string;

  if (pid !== -1) {
    owner = await getOwner(pid);
  } else {
    owner = '';
    pid = await createKeyboard(hardwareId);
  }

  const jwt = sign(
    {
      sub: owner,
      PID: pid,
    },
    JWT_SECRET,
    { expiresIn: 900 }, // JWT expires in 15 minutes
  );

  res.status(200);
  return res.send({ token: jwt });
};

/**
 * Accepts the hardware ID of a Pi and claims it for the user,
 * sending the Pi a new JWT indicating its new owner.
 */
const claimKeyboardHandler = async (req: Request, res: Response) => {
  // User initiates request to claim an unclaimed keyboard
  const hardwareIdString = req.body.boardId?.toString();
  const name = req.body.name?.toString();

  if (hardwareIdString === undefined || name === undefined) {
    return res.status(400).send('Missing parameters');
  }

  const hardwareId = parseInt(hardwareIdString, 10);
  const userId = req.user!.id;

  // Owner is set in DB
  const pid = await setOwner(userId, hardwareId, name);
  if (pid !== -1) {
    const jwt = sign(
      {
        sub: userId,
        PID: pid,
      },
      JWT_SECRET,
      { expiresIn: 900 }, // JWT expires in 15 minutes
    );

    sendMessageToRaspberryPi(pid, 'jwt', { jwt });

    res.status(200);
    return res.send(pid.toString());
  }
  res.status(400);
  return res.send('Keyboard already owned or has not come online yet');
};

const createSessionHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const boardId = parseInt(req.params.boardId, 10);
  const name = req.body.name.toString();

  if (name === undefined) {
    return res.status(400).send('Missing parameters');
  }

  const sessionId = await createSession(userId, boardId, name);

  if (sessionId === -1) {
    return res.status(400).send('Keyboard already in session');
  }
  return res.status(200).send(sessionId.toString());
};

const joinSesssionHandler = async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId, 10);
  const sessionId = parseInt(req.body.sessionId, 10);

  if (Number.isNaN(sessionId)) {
    return res.status(400).send('Invalid sessionId');
  }

  if (!await joinSession(boardId, sessionId)) {
    return res.status(400).send('Failed to join');
  }
  return res.status(200).send();
};

const leaveSessionHandler = async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId, 10);

  if (!await leaveSession(boardId)) {
    return res.status(400).send('Failed to leave session');
  }
  return res.status(200).send();
};

const closeSessionHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const sessionId = parseInt(req.body.sessionId, 10);

  if (Number.isNaN(sessionId)) {
    return res.status(400).send('Invalid sessionId');
  }

  if (!await closeSession(userId, sessionId)) {
    return res.status(400).send('Failed to close session');
  }
  return res.status(200).send();
};

const getKeyboardsHandler = async (req: Request, res: Response) => {
  const keyboards = await getKeyboards(req.user!.id);
  return res.status(200).send(keyboards);
};

const getActiveHandler = async (req: Request, res: Response) => {
  const keyboards = await getActiveKeyboard(req.user!.id);
  return res.status(200).send(keyboards);
};

const setActiveHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const boardId = parseInt(req.params.boardId, 10);

  if (await setActiveKeyboard(userId, boardId)) {
    return res.status(200).send();
  }
  return res.status(400).send();
};

const getSessionHandler = async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId, 10);

  const sessionId = await getSessionId(boardId);

  if (sessionId === -1) {
    return res.status(400).send('Board not in session');
  }
  return res.status(200).send(sessionId.toString());
};

const startRecordingHandler = async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId, 10);

  if (await startRecording(boardId)) {
    sendMessageToRaspberryPi(boardId, 'rec', { rec: 'start' });
    return res.status(200).send();
  }

  return res.status(400).send('Could not start recording');
};

const stopRecordingHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const boardId = parseInt(req.params.boardId, 10);
  const { name } = req.body;

  if (name === undefined) {
    return res.status(400).send('Missing parameters');
  }

  const nameString = name.toString();

  const recordingId = await stopRecording(boardId, userId, nameString);

  if (recordingId !== -1) {
    sendMessageToRaspberryPi(boardId, 'rec', { rec: 'stop', recordingId });
    return res.status(200).send();
  }

  return res.status(400).send('Could not start recording');
};

const uploadRecordingHandler = async (req: Request, res: Response) => {
  const file = req.file!.buffer;
  const recordingId = parseInt(req.body.recordingId, 10);

  if (Number.isNaN(recordingId)) {
    return res.status(400).send('Invalid recordingId');
  }

  if (await uploadFile(file, recordingId)) {
    return res.status(200).send();
  }

  return res.status(400).send('Internal error or invalid id');
};

const getRecordingHandler = async (req: Request, res: Response) => {
  const user = req.user!.id;
  const recordingId = parseInt(req.params.recordingId, 10);

  if (Number.isNaN(recordingId)) {
    return res.status(400).send('Invalid recordingId');
  }

  const { name, recording } = await getRecording(recordingId, user);

  if (recording && name) {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${name}.mid"`);
    return res.status(200).send(Buffer.from(recording, 'base64'));
  }

  return res.status(400).send('Internal error or invalid id');
};

const getRoleHandler = async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId, 10);

  const role = await getRole(boardId);

  if (role) {
    return res.status(200).send({ role });
  }

  return res.status(400).send('No role assigned');
};

export {
  authorizeKeyboardHandler,
  claimKeyboardHandler,
  createSessionHandler,
  joinSesssionHandler,
  leaveSessionHandler,
  closeSessionHandler,
  getKeyboardsHandler,
  getActiveHandler,
  setActiveHandler,
  getSessionHandler,
  startRecordingHandler,
  stopRecordingHandler,
  uploadRecordingHandler,
  getRecordingHandler,
  getRoleHandler,
};
