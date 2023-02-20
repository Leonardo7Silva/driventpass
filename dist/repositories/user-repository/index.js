import { prisma } from "@/config";
async function createUser(data) {
    return prisma.user.create({
        data
    });
}
;
const userRepository = {
    createUser
};
export default userRepository;
