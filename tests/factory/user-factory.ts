import { prisma } from "@/config";
import {faker } from "@faker-js/faker"
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export async function createUser(params: Partial<User> = {}){

    const incomingPassword = params.password || faker.internet.password(10);
    const hashedPassword = await bcrypt.hash(incomingPassword, 12);

    const user = await prisma.user.create({
        data:{
            email:params.email || faker.internet.email(),
            password:hashedPassword
        }
    })

    return user
}