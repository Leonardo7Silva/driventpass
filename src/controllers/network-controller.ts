import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import networkService from "@/service/network-service";

export async function postNetwork(req:AuthenticatedRequest, res:Response){

    const {userId}= req;
    const {network, password, title} = req.body;

    try{
        const newNetwork = await networkService.createNetwork({
            network,
            password,
            title,
        }, userId)

        return res.status(httpStatus.CREATED).send("NETWORK CREATED!");
    }catch(error){
        res.sendStatus(httpStatus.NOT_FOUND)
    }

};

export async function getAllNetworks(req: AuthenticatedRequest, res: Response){

    const {userId}= req;

    try{
        const networks = await networkService.findNetworks(userId);
        return res.status(httpStatus.OK).send(networks)
    }catch(error){
        return res.status(httpStatus.NOT_FOUND).send(error)
    }
};

export async function getOneNetwork(req: AuthenticatedRequest, res: Response){
    const {userId}= req;
    const {networkId} = req.params;

    const networkNumber = Number(networkId)
    if(isNaN(networkNumber)){
        return res.status(httpStatus.BAD_REQUEST).send("The params is invalid")
    };

    try{
        const network = await networkService.findANetwork({userId, networkId:networkNumber});

        return res.status(httpStatus.OK).send(network)

    }catch(error){
        if(error.name === "NotFoundError"){
            return res.status(httpStatus.NOT_FOUND).send(error)
        };

        if(error.name === "UnauthorizedError"){
            return res.status(httpStatus.FORBIDDEN).send(error)
        }

        return res.status(404).send("Deu ruim!")

    }

};

export async function deleteOneNetwork(req:AuthenticatedRequest, res:Response){

    const {userId}= req;
    const {networkId} = req.params;

    const networkNumber = Number(networkId)
    if(isNaN(networkNumber)){
        return res.status(httpStatus.BAD_REQUEST).send("The params is invalid")
    };

    try{
        const network = await networkService.deleteANetwork({userId, networkId:networkNumber});

        return res.status(httpStatus.OK).send("NETWORK DELETE!")

    }catch(error){
        if(error.name === "NotFoundError"){
            return res.status(httpStatus.NOT_FOUND).send(error)
        };

        if(error.name === "UnauthorizedError"){
            return res.status(httpStatus.FORBIDDEN).send(error)
        }

        return res.status(404).send("Deu ruim!")

    }
}