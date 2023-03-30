import userRepository from "../../repositories/user-repository";
import { invalidCredentialsError } from "./error";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signIn(params:SignInParams){
    const {email, password} = params;

    const user = await userRepository.findEmail(email);
    if(!user){
        throw invalidCredentialsError();
    };

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
        throw invalidCredentialsError();
    };

    const token = await createToken(user.id);

    return {
        id:user.id,
        email:user.email,
        token
    };
}

async function createToken(userId: number) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  
    return token;
  }

export type SignInParams = Pick<User, "email" | "password">;

const authService = {
    signIn
};

export default authService
