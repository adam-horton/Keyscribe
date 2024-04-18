import { Request, Response } from 'express';
import { createAccount } from '../db/user-db';

const loginHandler = (req: Request, res: Response) => res.status(200).send();

const registerHandler = async (req: Request, res: Response) => {
  const {
    username, password, emailAddress, firstName, lastName,
  } = req.body;
  try {
    if (!await createAccount(username, password, emailAddress, firstName, lastName)) {
      return res.status(401).send({ error: 'User already exists!' });
    }
    return res.status(200).send({ message: 'Account creation successful' });
  } catch (error) {
    return res.status(500).send({ error: 'Login failed' });
  }
};

const logoutHandler = async (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).send();
    }
    req.session.destroy((error) => {
      if (error) {
        res.status(500).send();
      }
      res.status(200).send();
    });
  });
};

export {
  loginHandler,
  registerHandler,
  logoutHandler,
};
