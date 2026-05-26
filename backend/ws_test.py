import asyncio
import websockets

async def test():
    async with websockets.connect('ws://localhost:8000/ws/incidents') as ws:
        msg = await ws.recv()
        print('SUCCESS:', msg)

asyncio.run(test())