import express, {Express} from "express";
import { userRouter } from "@/routes/index";
import cors from 'cors';
import { connectDb } from "./config";

const app = express();

app
    .use(cors())
    .use(express.json())
    .get("/health", (req, res)=>{res.send("OK!")})
    .use("/user", userRouter)



app.listen(4000, ()=>{
    connectDb();
    console.log("It's alive...")
});