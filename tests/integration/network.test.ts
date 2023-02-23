import httpStatus from "http-status";
import supertest from "supertest";
import app from "@/app"
import { close, init} from "@/app";
import { createUser, createNetworkWithUserIdAndPassword } from "../factory";
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

describe("GET: /network", ()=>{

    describe("When token is invalid", ()=>{
        
        it("should respond with status 401 if no token is given", async () => {
            const response = await api.get("/network");
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
        it("should respond with status 401 if given token is not valid", async () => {
            const token = faker.lorem.word();
            const response = await api.get("/network").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    });

    describe("When token is valid",()=>{

        it("should respond with status 404 if there is no networks", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.get("/network").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 200 in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const network = await createNetworkWithUserIdAndPassword(user.id, password);
            const result = await api.get("/network").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.OK);
        });

        it("should respond with a correct data in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const network = await createNetworkWithUserIdAndPassword(user.id, password);
            const result = await api.get("/network").set("Authorization", `Bearer ${token}`);

            expect(result.body).toEqual([{
                title: network.title,
                id: network.id,
                password: password,
                network: network.network
            }]);
        });
    });
});

describe("GET: /network/:networkId", ()=>{

    describe("When token is invalid", ()=>{
        
        it("should respond with status 401 if no token is given", async () => {
            const response = await api.get("/network/1");
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
        it("should respond with status 401 if given token is not valid", async () => {
            const token = faker.lorem.word();
            const response = await api.get("/network/1").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    });

    describe("When token is valid",()=>{

        it("should respond with status 400 if params is invalid", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.get("/network/a").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 404 if credential no exist", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.get("/network/0").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 403 if network belongs to another user", async ()=>{
            const user = await createUser();
            const user2 = await createUser();
            const token = await generateValidToken(user2);
            const password = faker.internet.password(10);
            const network = await createNetworkWithUserIdAndPassword(user.id, password);
            const result = await api.get(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.FORBIDDEN);
        });

        it("should respond with status 200 in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const network = await createNetworkWithUserIdAndPassword(user.id, password);
            const result = await api.get(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.OK);
        });

        it("should respond with a correct data in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const password = faker.internet.password(10);
            const network = await createNetworkWithUserIdAndPassword(user.id, password);
            const result = await api.get(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.body).toEqual({
                title: network.title,
                id: network.id,
                password: password,
                network: network.network,
            });
        });
    });
});

describe("POST: /network", ()=>{

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
            const response = await api.post("/network").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.BAD_REQUEST)
        });

        it("should respond with status 400 if the body is incomplete", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const response = await api.post("/network").set("Authorization", `Bearer ${token}`).send({
                password: faker.internet.password(),
            });

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });


        it("should respond with status 201 in case of success", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.post("/network").set("Authorization", `Bearer ${token}`).send({
                title: faker.name.firstName(),
                password: faker.internet.password(),
                network: faker.name.lastName(),
            });

            expect(result.status).toBe(httpStatus.CREATED);
        });
    });
});

describe("DELETE: /network/:networkId", ()=>{

    describe("When token is invalid", ()=>{
        
        it("should respond with status 401 if no token is given", async () => {
            const response = await api.delete("/network/1");
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
        
        it("should respond with status 401 if given token is not valid", async () => {
            const token = faker.lorem.word();
            const response = await api.delete("/network/1").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
          });
    });

    describe("When token is valid", ()=>{

        it("should respond with status 400 if params is invalid", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.delete("/network/a").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should respond with status 404 if credential no exist", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const result = await api.delete("/network/0").set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.NOT_FOUND)
        });

        it("should respond with status 403 if credential belongs to another user", async ()=>{
            const user = await createUser();
            const user2 = await createUser();
            const password = faker.internet.password(10);
            const network = await createNetworkWithUserIdAndPassword(user2.id, password);
            const token = await generateValidToken(user);
            const result = await api.delete(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.FORBIDDEN);
        });

        it("should respond with status 200 in case of success", async ()=>{
            const user = await createUser();
            const password = faker.internet.password(10);
            const network = await createNetworkWithUserIdAndPassword(user.id, password);
            const token = await generateValidToken(user);
            const result = await api.delete(`/network/${network.id}`).set("Authorization", `Bearer ${token}`);

            expect(result.status).toBe(httpStatus.OK);
        });


    });
});