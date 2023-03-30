import networkRepository from "../../repositories/network-repository";
import { CreateNetworkParams } from "../../repositories/network-repository";
import { notFoundError } from "../../errors/not-Found-error";
import { unauthorizedNetworkError } from "../../errors/forbbiden-network-error";

async function createNetwork(params: CreateNetworkParams, userId:number){

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);

    const encryptedPassword = cryptr.encrypt(params.password);
    const newNetwork = await networkRepository.createANetwork({
        title:params.title,
        password:encryptedPassword,
        network:params.network
    },userId)

    return newNetwork
};

async function findNetworks(userId:number){
    const networks = await networkRepository.findAllNetworks(userId)
    if(networks.length === 0){
        throw notFoundError();
    };

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);

    const decryptedNetworks = networks.map((value)=>{
        const decryptedPassword = cryptr.decrypt(value.password)
        return { 
            id: value.id,
            title: value.title,
            password: decryptedPassword,
            network: value.network
        }
    });

    return decryptedNetworks
};

async function findANetwork(params: FindOndNetwork){

    const network = await networkRepository.findOneNetwork(params.networkId);
    if(!network){
        throw notFoundError();
    };
    if(network.userId !== params.userId){
        throw unauthorizedNetworkError();
    };

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    const decryptedPassword = cryptr.decrypt(network.password);

    const decryptedNetwork = {
        id: network.id,
        title: network.title,
        password: decryptedPassword,
        network: network.network
    };

    return decryptedNetwork;

}

async function deleteANetwork(params:FindOndNetwork){
    const network = await networkRepository.findOneNetwork(params.networkId);
    if(!network){
        throw notFoundError();
    };
    if(network.userId !== params.userId){
        throw unauthorizedNetworkError();
    };

    const deletedNetwork = await networkRepository.deleteOneNetwork(params.networkId)
    return deletedNetwork
}

export type FindOndNetwork = {
    networkId: number,
    userId: number,
}

const networkService = {
    createNetwork,
    findNetworks,
    findANetwork,
    deleteANetwork,
};

export default networkService