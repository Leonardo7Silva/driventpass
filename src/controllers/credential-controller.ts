import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import { Response } from "express";
import credentialService from "../service/credential-service";


export async function postCredential(req:AuthenticatedRequest, res:Response){
    const {userId} = req;
    const {url, title, username, password }= req.body;

    try{
        const newCredential = await credentialService.createCredential({
            url,
            title,
            username,
            password,
        }, userId);

        return res.status(httpStatus.CREATED).send("CREDENTIAL CREATED!")

    }catch(error){
        res.status(httpStatus.CONFLICT).send(error)
    }
}

export async function getAllCredentials(req: AuthenticatedRequest, res:Response){
    const {userId} = req;

    try{
        const credentials = await credentialService.getCredentials(userId);

        return res.status(httpStatus.OK).send(credentials)
    }catch(error){
        return res.status(httpStatus.NOT_FOUND).send(error)
    }
}

export async function getOneCredential(req: AuthenticatedRequest, res:Response){
    const {userId}= req;
    const {credentialId} = req.params;

    const credentialNumber = Number(credentialId)
    if(isNaN(credentialNumber)){
        return res.status(httpStatus.BAD_REQUEST).send("The params is invalid")
    }

    try{
        const credential = await credentialService.getACredential({userId, credentialId: credentialNumber});

        return res.status(httpStatus.OK).send(credential)

    }catch(error){
        if(error.name === "NotFoundError"){
            return res.status(httpStatus.NOT_FOUND).send(error)
        };

        if(error.name === "UnauthorizedError"){
            return res.status(httpStatus.FORBIDDEN).send(error)
        }

    }
}

export async function deleteOneCredential(req: AuthenticatedRequest, res:Response){
    const {userId}= req;
    const {credentialId} = req.params;

    const credentialNumber = Number(credentialId)
    if(isNaN(credentialNumber)){
        return res.status(httpStatus.BAD_REQUEST).send("The params is invalid")
    }

    try{
        const deletedCredential = await credentialService.deleteAcredential({userId, credentialId: credentialNumber});

        return res.status(httpStatus.OK).send("Credential has been deleted!")

    }catch(error){
        if(error.name === "NotFoundError"){
            return res.status(httpStatus.NOT_FOUND).send(error)
        };

        if(error.name === "UnauthorizedError"){
            return res.status(httpStatus.FORBIDDEN).send(error)
        };

    }
}