import { createUser } from "./factory";
import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prisma } from "@/config";

export async function generateValidToken(user?: User) {
    const incomingUser = user || (await createUser());
    const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);
  
    return token;
  };

export async function cleanDB() {
    await prisma.credential.deleteMany({})
    await prisma.network.deleteMany({})
    await prisma.user.deleteMany({})
}
