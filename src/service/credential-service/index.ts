import credentialRepository from "../../repositories/credential-repository";
import { CrendentialParams } from "../../repositories/credential-repository";
import { duplicatedTitleError } from "../../errors/duplicate-title-error";
import { notFoundError } from "../../errors/not-Found-error";
import { unauthorizedCredentialError } from "../../errors/forbbiden-credential-error";


async function createCredential(params:CrendentialParams, userId:number){

    const isThereCredential = await credentialRepository.findCredentialWithUserIdAndName({
        userId,
        title: params.title
    });
    if(isThereCredential){
        throw duplicatedTitleError();
    }

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);

    const encryptedPassword = cryptr.encrypt(params.password);

    
    const newCredential = await credentialRepository.createACredential({
        title: params.title,
        username: params.username,
        password: encryptedPassword,
        url: params.url
    }, userId);

    return newCredential
};

async function getCredentials(userId:number){
    const credentials = await credentialRepository.findCredentials(userId);
    if(credentials.length === 0){
        throw notFoundError();
    }



    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);


    const decryptedCredencials = credentials.map((value)=>{
        const decryptedPassword = cryptr.decrypt(value.password)
        return { 
            id: value.id,
            title: value.title,
            url: value.url,
            username: value.username,
            password: decryptedPassword
        }
    });

    return decryptedCredencials;

};

async function getACredential(params:OneCredentialFinder){
    const credential = await credentialRepository.findOneCredential(params.credentialId);
    if(!credential){
        throw notFoundError();
    };

    if(credential.userId !== params.userId){
        throw unauthorizedCredentialError();
    };

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const decryptedPassword = cryptr.decrypt(credential.password)

    const decryptedCredential = {
        id: credential.id,
        title: credential.title,
        url:credential.url,
        username:credential.username,
        password: decryptedPassword
    };

    return decryptedCredential

};

async function deleteAcredential(params:OneCredentialFinder){
    const credential = await credentialRepository.findOneCredential(params.credentialId);
    if(!credential){
        throw notFoundError();
    };

    if(credential.userId !== params.userId){
        throw unauthorizedCredentialError();
    };

    const deletedCredential = await credentialRepository.deleteCredential(params.credentialId);
    return deletedCredential;
}

export type OneCredentialFinder = {
    userId: number,
    credentialId:number,
}

const credentialService = {
    createCredential,
    getCredentials,
    getACredential,
    deleteAcredential,
}

export default credentialService