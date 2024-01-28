import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'https';
import { JwtPayload, verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { getConnectedKeyboards } from '../db/db';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const JWT_SECRET: string = process.env.JWT_SECRET!;

const connections: Map<number, WebSocket> = new Map();

// Function to send WebSocket messages to Raspberry Pi
const sendMessageToRaspberryPi = (id: number, note: string) => {
  const ws = connections.get(id);  
  // console.log("Reached 1")

  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = JSON.stringify({
      id, note
    });
    ws.send(message);
  }
};

const wsSetup = (httpsServer: Server): WebSocketServer => {
  const wss = new WebSocketServer({ server: httpsServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // Check that request has valid JWT (with or without an associated user)
    const authorization = req.headers.authorization!;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      ws.close();
      return;
    }

    verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        ws.close();
      } else {
        connections.set((decoded as JwtPayload).PID, ws);
      }
    });

    ws.on('message', (raw_message) => {
      const message = JSON.parse(raw_message.toString());

      verify(message.token as string, JWT_SECRET, async (err, decoded) => {
        if (err) {
          // console.log("Error")
          ws.close();
        } else {
          // console.log('Empty')
          const pairedKeyboards = await getConnectedKeyboards((decoded as JwtPayload).PID);

          pairedKeyboards.forEach((id: number) => {
            if (message.note !== "[]") {
              // console.log('Note: ', message.note)
              sendMessageToRaspberryPi(
                id,
                message.note.toString(),
              );
            }
          });
        }
      });
    });
  });

  return wss;
};

const getWebsocketConnections = (): Map<number, WebSocket> => connections;

export {
  getWebsocketConnections,
  wsSetup,
  sendMessageToRaspberryPi,
};
