import { PrismaClient } from '@prisma/client';
//const prisma = new PrismaClient()
export let prisma;
export function connectDb() {
    prisma = new PrismaClient();
}
export async function disconnectDB() {
    await prisma?.$disconnect();
}
