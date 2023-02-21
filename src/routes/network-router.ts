import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { validateBody } from "@/middlewares";
import { postNetwork, getAllNetworks, getOneNetwork, deleteOneNetwork} from "@/controllers";
import { networkSchema } from "@/schemas";

const networkRouter = Router();

networkRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(networkSchema), postNetwork)
    .get("/", getAllNetworks)
    .get("/:networkId", getOneNetwork)
    .delete("/:networkId", deleteOneNetwork)

export {networkRouter}