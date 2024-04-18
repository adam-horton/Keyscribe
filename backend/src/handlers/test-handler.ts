import { Request, Response } from 'express';

const helloWorld = (req: Request, res: Response) => {
  res.send('This is a test!');
};

const helloWorld2 = (req: Request, res: Response) => {
  res.send('This is another test!');
};

export {
  helloWorld,
  helloWorld2,
};
