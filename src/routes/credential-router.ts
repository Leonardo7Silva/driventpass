import { Router } from "express";
import { validateBody } from "../middlewares";
import { credentialSchema } from "../schemas";
import { postCredential, getAllCredentials, getOneCredential, deleteOneCredential} from "../controllers/credential-controller";
import { authenticateToken } from "../middlewares";

const credentialRouter = Router();

credentialRouter
    .all("/*", authenticateToken)
    .post("/", validateBody(credentialSchema), postCredential)
    .get("/", getAllCredentials)
    .get("/:credentialId", getOneCredential)
    .delete("/:credentialId", deleteOneCredential )


export {credentialRouter}

