import { Router } from "express";
import { postUser } from "@/controllers/user-controller";
const userRouter = Router();
userRouter.post("/", postUser);
export { userRouter };
