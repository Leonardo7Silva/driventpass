import { prisma } from "@/config";
import { Credential } from "@prisma/client";

async function createACredential(params: CrendentialParams, userId: number){
 const createdCredential = await prisma.credential.create({
    data:{
        ...params,
        userId
    }
 });
 return createdCredential;
}

async function findCredentialWithUserIdAndName(params:CredentialFinder){

    const finder = await prisma.credential.findFirst({
        where:{
            userId: params.userId,
            title: params.title,
        }
    })
    return finder 
}

async function findCredentials(userId:number){
    const credentials = await prisma.credential.findMany({
        where:{
            userId
        }
    });
    return credentials
}

async function findOneCredential(credentialId:number){
    const credential = await prisma.credential.findFirst({
        where:{
            id: credentialId
        }
    });
    return credential
};

async function deleteCredential(credentialId:number){
    const deletedCredential = await prisma.credential.delete({
        where:{
            id:credentialId
        }
    });
    return deletedCredential;
}

export type CrendentialParams = Pick<Credential, "password" | "title" | "url" | "username">

export type CredentialFinder = {
    userId:number,
    title:string,
}


const credentialRepository = {
    createACredential,
    findCredentialWithUserIdAndName,
    findCredentials,
    findOneCredential,
    deleteCredential,
};

export default credentialRepository;