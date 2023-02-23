import express, {Express} from "express";
import cors from 'cors';
import { connectDb, disconnectDB} from "./config";
import { userRouter, authRouter, credentialRouter, networkRouter} from "./routes";

const app = express();

app
    .use(cors())
    .use(express.json())
    .get("/health", (req, res)=>{res.send("OK!")})
    .use("/user", userRouter)
    .use("/auth", authRouter)
    .use("/credential", credentialRouter)
    .use("/network", networkRouter)




app.listen(4000, ()=>{
    connectDb();
    console.log("It's alive...")
});

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
  }

export async function close(): Promise<void> {
    await disconnectDB();
  }

export default app;