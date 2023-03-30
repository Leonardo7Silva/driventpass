import httpStatus from "http-status";
import supertest from "supertest";
import app from "../../src/app"
import { close, init} from "../../src/app";
import { createUser, createCredentialWithUserIdAndPassword } from "../factory";
import {faker } from "@faker-js/faker"
import { generateValidToken, cleanDB } from "../helpers";

const api = supertest(app);

beforeAll(async ()=>{
    await init()
})

afterAll(async ()=>{
    await cleanDB();
    await close();
})
 
beforeEach(async ()=>{
    await cleanDB()
});


describe("GET: /credential", ()=>{

    describe("When token is invalid", ()=>{
        
        it("should respond with status 401 if no token is given", async () => {
            const response = await api.get("/credential");
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
        it("should respond with status 401 if given token is not valid", async () => {
            const token = faker.lorem.word();
            const response = await api.get("/credential").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    });

    describe("When token is valid",()=>{

        it("should respond with status 404 if there is no credentials", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.get("/credential").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 200 in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const credential = await createCredentialWithUserIdAndPassword(user.id, password);
            const result = await api.get("/credential").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.OK);
        });

        it("should respond with a correct data in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const credential1 = await createCredentialWithUserIdAndPassword(user.id, password);
            const result = await api.get("/credential").set("Authorization", `Bearer ${token}`);

            expect(result.body).toEqual([{
                title: credential1.title,
                id: credential1.id,
                password: password,
                url: credential1.url,
                username:credential1.username

            }]);
        });
    });
});


describe("GET: /credential/:credentialId", ()=>{

    describe("When token is invalid", ()=>{
        
        it("should respond with status 401 if no token is given", async () => {
            const response = await api.get("/credential/1");
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
        it("should respond with status 401 if given token is not valid", async () => {
            const token = faker.lorem.word();
            const response = await api.get("/credential/1").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    });

    describe("When token is valid",()=>{

        it("should respond with status 400 if params is invalid", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.get("/credential/a").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 404 if credential no exist", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.get("/credential/0").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 403 if credential belongs to another user", async ()=>{
            const user = await createUser();
            const user2 = await createUser();
            const token = await generateValidToken(user2);
            const password = faker.internet.password(10);
            const credential = await createCredentialWithUserIdAndPassword(user.id, password);
            const result = await api.get(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.FORBIDDEN);
        });

        it("should respond with status 200 in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const credential = await createCredentialWithUserIdAndPassword(user.id, password);
            const result = await api.get(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.OK);
        });

        it("should respond with a correct data in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const credential1 = await createCredentialWithUserIdAndPassword(user.id, password);
            const result = await api.get(`/credential/${credential1.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.body).toEqual({
                title: credential1.title,
                id: credential1.id,
                password: password,
                url: credential1.url,
                username:credential1.username

            });
        });
    });
});

describe("POST: /credential", ()=>{

    describe("When token is invalid", ()=>{
        
        it("should respond with status 401 if no token is given", async () => {
            const response = await api.post("/credential");
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
        it("should respond with status 401 if given token is not valid", async () => {
            const token = faker.lorem.word();
            const response = await api.post("/credential").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    });

    describe("When token is valid", ()=>{

        it("should respond with status 400 if no body is give", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await api.post("/credential").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        });

        it("should respond with status 400 if the body is incomplete", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await api.post("/credential").set("Authorization", `Bearer ${token}`).send({
                url:faker.internet.url(),
                password: faker.internet.password(),
            });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 409 if title is duplicated", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10)
            const credential = await createCredentialWithUserIdAndPassword(user.id, password);
            const result = await api.post("/credential").set("Authorization", `Bearer ${token}`).send({
                title: credential.title,
                password: faker.internet.password(),
                url: faker.internet.url(),
                username: faker.internet.userName(),
            });

            expect(result.status).toBe(httpStatus.CONFLICT)
        });

        it("should respond with status 201 in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.post("/credential").set("Authorization", `Bearer ${token}`).send({
                title: faker.name.firstName(),
                password: faker.internet.password(),
                url: faker.internet.url(),
                username: faker.internet.userName(),
            });

            expect(result.status).toBe(httpStatus.CREATED);
        });
    });
});

describe("DELETE: /credential/:credentialId", ()=>{

    describe("When token is invalid", ()=>{
        
        it("should respond with status 401 if no token is given", async () => {
            const response = await api.delete("/credential/1");
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
        it("should respond with status 401 if given token is not valid", async () => {
            const token = faker.lorem.word();
            const response = await api.delete("/credential/1").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    });

    describe("When token is valid", ()=>{

        it("should respond with status 400 if params is invalid", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.delete("/credential/a").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 404 if credential no exist", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.delete("/credential/0").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.NOT_FOUND)
        });

        it("should respond with status 403 if credential belongs to another user", async ()=>{
            const user = await createUser();
            const user2 = await createUser();
            const password = faker.internet.password(10);
            const credential = await createCredentialWithUserIdAndPassword(user2.id, password);
            const token = await generateValidToken(user);
            const result = await api.delete(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.FORBIDDEN);
        });

        it("should respond with status 200 in case of success", async ()=>{
            const user = await createUser();
            const password = faker.internet.password(10);
            const credential = await createCredentialWithUserIdAndPassword(user.id, password);
            const token = await generateValidToken(user);
            const result = await api.delete(`/credential/${credential.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.OK);
        });


    });
})