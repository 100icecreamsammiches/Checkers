import websockets
import asyncio
import json
from app import init

connected = []

async def handler(websocket):
    print("in progress")
    async for message in websocket:
        message = json.loads(message)
        print(message)
        if websocket not in connected:
            connected.append(websocket)
        websockets.broadcast(iter(connected), json.dumps(message))


async def server():
    print("start serving")
    async with websockets.serve(handler,host="localhost", port=5001):
        print("serving")
        await asyncio.Future()

async def main():
    f1 = loop.create_task(server())
    f2 = loop.create_task(init())
    await asyncio.wait([f1, f2])


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    loop.close()