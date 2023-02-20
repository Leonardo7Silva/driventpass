var bcrypt = require('bcrypt');
import userRepository from "@/repositories/user-repository";
async function createAUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    return await userRepository.createUser({
        email: userData.email,
        password: hashedPassword
    });
}
;
const userService = {
    createAUser
};
export default userService;
