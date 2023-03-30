import { singInPost } from "../controllers";
import { validateBody } from "../middlewares";
import { signInSchema } from "../schemas";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/signin", validateBody(signInSchema), singInPost);

export { authRouter };