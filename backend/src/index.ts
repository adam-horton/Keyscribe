import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import pgSessionSimple from 'connect-pg-simple';
import { Strategy as LocalStrategy } from 'passport-local';
import { wsSetup } from './websockets/websocket-setup';
import { validateLogin, getUserById } from './db/user-db';
import { getPool } from './db/db-setup';

// ROUTES
import routes from './routes/routes';

// ENV FILE
dotenv.config();

// DEFINE APP AND SETUP BASIC REQUIREMENTS
const app: Application = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.use(express.static(path.join(__dirname, '../../frontend/public')));
app.use(cors());
const PGSession = pgSessionSimple(session);
app.use(session({
  store: new PGSession({
    pool: getPool(),
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));

// PASSPORT SETUP
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await validateLogin(username, password);
      if (user === null) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
));

passport.serializeUser((user: Express.User, done) => {
  process.nextTick(() => done(null, user.id));
});

passport.deserializeUser((id: string, done) => {
  process.nextTick(async () => done(null, await getUserById(id)));
});

app.use(passport.initialize());
app.use(passport.session());

// DEFINE ROUTES HERE

app.use('/api', routes);

app.use((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// START SERVER
const server = https.createServer({
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem'),
}, app);

wsSetup(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
