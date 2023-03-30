import Joi from "joi";
import { CrendentialParams } from "../repositories/credential-repository";

export const credentialSchema = Joi.object<CrendentialParams>({
    title: Joi.string().min(3).required(),
    url: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
})