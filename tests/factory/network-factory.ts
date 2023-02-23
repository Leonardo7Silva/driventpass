import { prisma } from "@/config";
import {faker } from "@faker-js/faker"


export async function createNetworkWithUserIdAndPassword(userId: number, password:string){

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const encryptedPassword = cryptr.encrypt(password);


    const network = await prisma.network.create({
        data:{
            userId: userId,
            title: faker.name.firstName(),
            password: encryptedPassword,
            network: faker.name.lastName(),
        }
    });

    return network;
}