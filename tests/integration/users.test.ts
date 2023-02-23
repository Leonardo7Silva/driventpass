import httpStatus from "http-status";
import supertest from "supertest";
import app from "@/app"
import { close, init} from "@/app";
import { createUser } from "../factory";
import {faker } from "@faker-js/faker";
import { cleanDB } from "../helpers";

const api = supertest(app);

beforeAll(async ()=>{
    await init()
})

afterAll(async ()=>{
    await cleanDB();
})
 
beforeEach(async ()=>{
    await cleanDB()
});



describe("POST: /users", ()=>{

    it("should respond 400 if there is no body", async ()=>{
        const result = await api.post("/user").send({})

        expect(result.status).toBe(httpStatus.BAD_REQUEST)
    });

    it("should respond 400 if there is no password", async ()=>{
        const result = await api.post("/user").send({
            email: "email@gmail.com"
        })
        expect(result.status).toBe(httpStatus.BAD_REQUEST)
    });

    it("should respond 400 if the password has less than ten characters", async ()=>{
        const result = await api.post("/user").send({
            email: "email@gmail.com",
            password: "012345678"
        })
        expect(result.status).toBe(httpStatus.BAD_REQUEST)
    });

    it("should respond 201 if the password has ten characters", async ()=>{
        const result = await api.post("/user").send({
            email: "email@gmail.com",
            password: "0123456789"
        })
        expect(result.status).toBe(httpStatus.CREATED)
    });

    it("should respond 409 if email already exist", async ()=>{
        const user = await createUser();
        const result = await api.post("/user").send({
            email: user.email,
            password:"passwordTest"
        })
        expect(result.status).toBe(httpStatus.CONFLICT)
    });

    it("should respond 201 in case of success", async () => {
        const result = await api.post("/user").send({
            email:"test@test.com",
            password:"passwordTest"
        });
        expect(result.status).toBe(httpStatus.CREATED)
    })
});

describe("POST: /auth/signin", ()=>{

    it("should respond 400 if there is no body", async ()=>{
        const result = await api.post("/auth/signin").send({})
        expect(result.status).toBe(httpStatus.BAD_REQUEST)
    });

    it("should respond 400 if there is no password", async ()=>{
        const result = await api.post("/auth/signin").send({
            email: "email@gmail.com"
        })
        expect(result.status).toBe(httpStatus.BAD_REQUEST)
    });

    describe("when body is valid", () => {
        const generateValidBody = () => ({
          email: faker.internet.email(),
          password: faker.internet.password(10),
        });

        it("should respond with status 401 if there is no user for given email", async () => {
            const body = generateValidBody();
            const response = await api.post("/auth/signin").send(body);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
            const user = await createUser();
            const response = await api.post("/auth/signin").send({
              email: user.email,
              password: faker.lorem.word(),
            });
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });

        describe("Cases of Succes", ()=>{

            it("should respond 200", async ()=>{
                const body = generateValidBody();
                const user = await createUser(body);
                const response = await api.post("/auth/signin").send(body);
                expect(response.status).toBe(httpStatus.OK);
            });

            it("should respond a valid token", async ()=>{
                const body = generateValidBody();
                const user = await createUser(body);
                const response = await api.post("/auth/signin").send(body);

                expect(response.body.token).toBeDefined()
            })
        })
    });

   
})

