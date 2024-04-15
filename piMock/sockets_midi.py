import ast
import json
import asyncio
import websockets
import ssl
import requests
import sys

ID = "00000001"
if len(sys.argv) == 2:
    ID = sys.argv[1]

auto_id = ""
token = ""
headers = ""
midi_input = ""
connected = False
server_url = "wss://localhost:8000/ws"
http_url = "https://localhost:8000/api/authorize"


ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.load_verify_locations("keys/cert.pem")
ssl_context.load_default_certs(ssl.Purpose.CLIENT_AUTH)
ssl_context.check_hostname = False  # Disable hostname verification

#########################################################################################################

# Function to handle the received WebSocket message
async def receive_messages(websocket):
    global auto_id, token
    try:
        while True:
            raw_message = await websocket.recv()
            if raw_message:
                message = json.loads(raw_message)

                if message["type"] == "note":
                    print(message["note"])
                elif message["type"] == "jwt":
                    token = message["jwt"]

                await asyncio.sleep(0.05)  # Add a small delay to avoid busy-wait
    except websockets.ConnectionClosed as e:
        # Handle a closed connection
        print("Connection closed:", e)
            
#########################################################################################################

async def main():
    global connected, headers, token

    # Sending HTTP request to authorize websocket connection
    message = {'hardwareId': ID}
    response = requests.get(http_url, params = message, verify=False)

    # if not verified
    if response.status_code != 200:
        print("No authorization")
    # if verified, save token and establish websocket connection
    else:
        json_object_returned = response.json()
        print(json_object_returned) ##
        token = json_object_returned.get("token")
        headers = [('Authorization', 'Bearer ' + token)]
        print(headers) ##
        print("I got the token: ", token)##

        async with websockets.connect(server_url, ssl=ssl_context, extra_headers = headers) as websocket:
            print("Connected to Server")
            # Create a task to receive messages
            recv_task = asyncio.ensure_future(receive_messages(websocket))

            mock_counter = 0
            alternator = 0
            while True:
                # send that message back
                mock_counter += 1
                if mock_counter % 20 == 0:
                    # Send a sample note once per second
                    alternator = 0 if alternator == 1 else 1
                    message = {"token": token, "note": "[[[" + str(128 + (16*alternator)) + ", 35, 0, 0], 1234]]"}
                    await websocket.send(json.dumps(message))

                await asyncio.sleep(0.05)  # Add a small delay to avoid busy-wait

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())