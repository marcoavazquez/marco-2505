import { Response } from "@/types";
import { LoginDto, RegisterDto } from "../dtos";
import { userRepositoty } from "@/lib/db";
import { User } from "@/types/users";


export const SESSION_KEY = "sisu.auth.session";

export const authService = {
  async login(data: LoginDto): Promise<Response<User>> {

    const user = userRepositoty.find(data.email)

    if (!user) {
      return {
        success: false,
        message: "Usuario no econtrado",
        errors: {
          email: ["Usuario no econtrado"]
        },
        data: null
      }
    }

    return {
      success: true,
      message: "¡Bienvenido de nuevo!",
      data: user,
    };
  },

  async register(data: RegisterDto): Promise<Response<User>> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const exists = userRepositoty.find(data.email)

    if (exists) {
      return {
        success: false,
        message: "Ya existe una cuenta registrada con ese correo",
        errors: {
          email: ["Ya existe una cuenta registrada con ese correo"]
        },
        data: null
      }
    }

    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      name: data.fullName,
      createdAt: new Date().toISOString(),
    };

    userRepositoty.save(newUser)

    return {
      data: newUser,
      success: true,
      message: "¡Cuenta creada exitosamente!",
    };
  },
};
