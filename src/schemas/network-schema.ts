import Joi from "joi";
import { CreateNetworkParams } from "../repositories/network-repository";

export const networkSchema = Joi.object<CreateNetworkParams>({
    title: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    network: Joi.string().min(3).required(),
})