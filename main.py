import websockets
import asyncio
import json
from app import init

connected = []

async def handler(websocket):
    async for message in websocket:
        message = json.loads(message)
        print(message)
        if websocket not in connected:
            connected.append(websocket)
        websockets.broadcast(iter(connected), json.dumps(message))


async def main():
    async with websockets.serve(handler,host="localhost", port=8001):
        await init()
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
