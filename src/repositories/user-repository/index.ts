import  {prisma}  from "../../config";
import { Prisma } from "@prisma/client";

async function createUser(data: Prisma.UserUncheckedCreateInput){

    return prisma.user.create({
        data:{
            email:data.email,
            password:data.password
        }
    })
};

async function findEmail(email:string){
    return prisma.user.findFirst({
        where:{
            email
        }
    })
}

const userRepository = {
    createUser,
    findEmail,
};

export default userRepository
