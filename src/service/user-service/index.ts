var bcrypt = require('bcrypt');
import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { duplicatedEmailError } from "@/errors/invalid-email-error";

export type CreateUserParams = Pick<User, "email"|"password">

async function createAUser(userData:CreateUserParams){

    const foundedUser = await userRepository.findEmail(userData.email);
    if(foundedUser){
        throw duplicatedEmailError();
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    return await userRepository.createUser({
        email: userData.email,
        password:hashedPassword
    })
};

const userService = {
    createAUser
};

export default userService;