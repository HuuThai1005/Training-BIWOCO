import { authService } from "../services/auth.service"
import { loginSchema } from "../schemas/login.schema"
import { ZodError } from "zod"

export const loginHandler = async (body: unknown) => {
  try {
    const data = loginSchema.parse(body)
    const user = authService.login(data)

    return {
      success: true,
      user
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Invalid request data"
      }
    }

    return {
      success: false,
      message: (error as Error).message
    }
  }
}
