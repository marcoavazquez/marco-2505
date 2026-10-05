import { LoginDto, RegisterDto } from "../dtos";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

/**
 * Authentication service handling login and register operations.
 */
export const authService = {

  async login(data: LoginDto): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "¡Bienvenido de nuevo!",
      user: {
        id: "usr_101",
        email: data.user,
        fullName: data.user.split("@")[0],
      },
    };
  },

  async register(data: RegisterDto): Promise<AuthResponse> {

    // Simulate async API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: AuthUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      fullName: data.fullName,
    };

    return {
      success: true,
      message: "¡Cuenta creada exitosamente!",
      user: newUser,
    };
  },
};
