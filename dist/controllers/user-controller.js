import userService from "@/service/user-service";
export async function postUser(req, res) {
    const { email, password } = req.body;
    try {
        const user = await userService.createAUser({ email, password });
        return res.status(201).json({
            id: user.id,
            email: user.email
        });
    }
    catch (error) {
        console.log(error);
        res.send("deu ruim!");
    }
}
