import { userRepo } from "../repositories/user.repo"
import { loginRequest } from "../schemas/login.schema"

export const authService = {
     login(data: loginRequest){
        const emailExisting = userRepo.findByEmail(data.email)
        if(!emailExisting){
            throw new Error("User not found!")
        }
        else if (emailExisting.password !== data.password){
            throw new Error("Invalid password!")
        }

        return emailExisting
     }
};