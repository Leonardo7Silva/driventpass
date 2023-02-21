import express, {Express} from "express";
import cors from 'cors';
import { connectDb } from "./config";
import { userRouter, authRouter, credentialRouter } from "./routes";

const app = express();

app
    .use(cors())
    .use(express.json())
    .get("/health", (req, res)=>{res.send("OK!")})
    .use("/user", userRouter)
    .use("/auth", authRouter)
    .use("/credential", credentialRouter)




app.listen(4000, ()=>{
    connectDb();
    console.log("It's alive...")
});

export default app;