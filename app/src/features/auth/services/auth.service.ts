import { Response } from "@/types";
import { LoginDto, RegisterDto } from "../dtos";
import { userRepositoty } from "@/lib/db/user";
import { hashPassword, verifyPassword } from "@/lib/password";
import { SESSION_KEY, authSession } from "@/lib/session";
import { User, StoredUser } from "@/types/user";


export { SESSION_KEY };

const INVALID_CREDENTIALS = "Correo o contraseña incorrectos";

export const authService = {
  async login(data: LoginDto): Promise<Response<User>> {

    const stored = userRepositoty.find<StoredUser>(data.email)

    if (!stored) {
      return {
        success: false,
        message: INVALID_CREDENTIALS,
        errors: {
          email: [INVALID_CREDENTIALS]
        },
        data: null
      }
    }

    const validPassword = await verifyPassword(data.password, stored.passwordHash)

    if (!validPassword) {
      return {
        success: false,
        message: INVALID_CREDENTIALS,
        errors: {
          password: [INVALID_CREDENTIALS]
        },
        data: null
      }
    }

    const user: User = {
      id: stored.id,
      fullName: stored.fullName,
      email: stored.email,
      createdAt: stored.createdAt,
    };

    authSession.save(user)

    return {
      success: true,
      message: "¡Bienvenido de nuevo!",
      data: user,
    };
  },

  async register(data: RegisterDto): Promise<Response<User>> {

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

    const user: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      fullName: data.fullName,
      createdAt: new Date().toISOString(),
    };

    userRepositoty.save<StoredUser>({ ...user, passwordHash: await hashPassword(data.password) })

    return {
      data: user,
      success: true,
      message: "¡Cuenta creada exitosamente!",
    };
  },
};
