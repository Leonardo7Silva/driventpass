import { prisma } from "../../src/config"
import {faker } from "@faker-js/faker"
import { User } from "@prisma/client";


export async function createCredentialWithUserIdAndPassword(userId: number, password:string){

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const encryptedPassword = cryptr.encrypt(password);


    const credential = await prisma.credential.create({
        data:{
            url: faker.internet.url(),
            userId: userId,
            username: faker.internet.userName(),
            title: faker.name.firstName(),
            password: encryptedPassword,
        }
    });

    return credential;
}