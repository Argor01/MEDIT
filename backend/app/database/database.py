from prisma import Prisma

prisma = Prisma(auto_register=True)

async def connect_db():
    await prisma.connect()

async def disconnect_db():
    await prisma.disconnect()