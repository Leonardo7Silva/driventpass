import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import { unauthorizedError } from "@/errors/unauthorized-error";

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.header("Authorization");
    if (!authHeader) return unauthorizedResponse(res);
  
    const token = authHeader.split(" ")[1];
    if (!token) return unauthorizedResponse(res);

    try{
        const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    
        req.userId = userId;
        return next();
    }catch(err){
        return unauthorizedResponse(res);
    }
  
}

function unauthorizedResponse(res: Response) {
    res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
  }
  
export type AuthenticatedRequest = Request & JWTPayload;
  
type JWTPayload = {
    userId: number;
  };