import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { getOwner } from '../db/keyboard-db';

const authenticate = passport.authenticate('local');

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send();
};

const boardOwnershipCheck = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const boardId = parseInt(req.params.boardId, 10);

  if (Number.isNaN(boardId)) return res.status(400).send();

  if (await getOwner(boardId) === userId) {
    return next();
  }

  return res.status(401).send();
};

export {
  authenticate,
  isAuthenticated,
  boardOwnershipCheck,
};
