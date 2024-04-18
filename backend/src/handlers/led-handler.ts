import { WebSocket } from 'ws';
import { Request, Response } from 'express';
import { getWebsocketConnections } from '../websockets/websocket-setup';

// Function to send WebSocket messages to Raspberry Pi
const sendMessageToRaspberryPi = (message: string) => {
  const connections = getWebsocketConnections();

  if (connections.length !== 0) {
    // Loop through connected clients and send the message
    connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
};

const ledOn = (req: Request, res: Response) => {
  if (req.body.color) {
    const ledColor = req.body.color;
    sendMessageToRaspberryPi(ledColor);
    res.status(200);
    res.send();
  } else {
    res.status(400);
    res.send('No color specified');
  }
};

// eslint-disable-next-line import/prefer-default-export
export { ledOn };
