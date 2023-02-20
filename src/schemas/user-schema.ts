import Joi from "joi";
import { CreateUserParams } from "@/service";

export const createUserSchema = Joi.object<CreateUserParams>({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
});