import { loginHandler } from "./handlers/user.handler";

export const main = async() =>{
    const res = await loginHandler({
        email: "thainh@gmail.com",
        password: "123456789"
    })

    console.log(res);
}

main()