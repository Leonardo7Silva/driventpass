import { prisma } from "../../config";
import { Network } from "@prisma/client";

async function createANetwork(params:CreateNetworkParams, userId:number){
    const network = await prisma.network.create({
        data:{
            ...params,
            userId
        }
    })
}

async function findAllNetworks(userId:number){
    const networks = await prisma.network.findMany({
        where:{
            userId
        }
    });
    return networks
};

async function findOneNetwork(networkId:number){
    const network = await prisma.network.findFirst({
        where:{
            id: networkId
        }
    });
    return network
};

async function deleteOneNetwork(networkId:number){
    const network = await prisma.network.delete({
        where:{
            id: networkId
        }
    });

    return network;
}

export type CreateNetworkParams = Pick<Network, "network" | "password" | "title">

const networkRepository = {
    createANetwork,
    findAllNetworks,
    findOneNetwork,
    deleteOneNetwork,
};

export default networkRepository