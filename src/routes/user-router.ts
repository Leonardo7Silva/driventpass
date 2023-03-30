import { Router } from "express";
import { postUser } from "../controllers/user-controller";
import { validateBody } from "../middlewares";
import { createUserSchema } from "../schemas/user-schema";

const userRouter = Router();

userRouter
    .post("/", validateBody(createUserSchema),postUser);

export {userRouter};