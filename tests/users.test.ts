import { prisma } from "./config";
import httpStatus from "http-status";
import supertest from "supertest";
import app from "@/app"

const api = supertest(app);

describe("POST: /users", ()=>{

    it("should respond 400 if there is no body", async ()=>{
        const result = await api.post("/user").send({})

        expect(result.status).toBe(httpStatus.BAD_REQUEST)
    })
})