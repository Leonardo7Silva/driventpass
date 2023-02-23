import userService from "@/service/user-service"
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function postUser(req:Request, res:Response){

    const {email, password}= req.body;

    try{
        const user = await userService.createAUser({email, password});

        return res.status(httpStatus.CREATED).json({
            id: user.id,
            email: user.email
        })
    }catch(error){
        return res.status(httpStatus.CONFLICT).send(error);
    }

}