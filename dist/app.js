import express from "express";
import { userRouter } from "@/routes/index";
const app = express();
app
    .use(express.json())
    .get("/health", (req, res) => { res.send("OK!"); })
    .use("/user", userRouter);
app.listen(4000, () => {
    console.log("It's alive...");
});
