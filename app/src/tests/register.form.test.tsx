import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import { RegisterView } from "../features/auth/components/RegisterView";
import { authService } from "../features/auth/services/auth.service";
import { USERS_KEY } from "@/lib/db/user";

const validData = {
  fullName: "Ana Martínez",
  email: "ana@example.com",
  password: "secret123",
  confirmPassword: "secret123",
};

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  values: Partial<typeof validData> = validData
) => {
  if (values.fullName !== undefined) {
    await user.type(screen.getByLabelText("Nombre completo"), values.fullName);
  }
  if (values.email !== undefined) {
    await user.type(screen.getByLabelText("Correo electrónico"), values.email);
  }
  if (values.password !== undefined) {
    await user.type(screen.getByLabelText("Contraseña"), values.password);
  }
  if (values.confirmPassword !== undefined) {
    await user.type(
      screen.getByLabelText("Confirmar contraseña"),
      values.confirmPassword
    );
  }
};

describe("RegisterForm", () => {
  it("renders every input of the registration form", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText("Nombre completo")).toHaveAttribute(
      "name",
      "fullName"
    );
    expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute(
      "name",
      "email"
    );
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
      "name",
      "password"
    );
    expect(screen.getByLabelText("Confirmar contraseña")).toHaveAttribute(
      "name",
      "confirmPassword"
    );
    expect(
      screen.getByRole("button", { name: "Registrarse" })
    ).toBeInTheDocument();
  });

  it("links to the login page", () => {
    render(<RegisterForm />);

    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("shows a field error when the email is invalid", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillForm(user, { ...validData, email: "not-an-email" });
    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    expect(
      await screen.findByText("Ingresa un correo electrónico válido")
    ).toBeInTheDocument();
  });

  it("shows a field error when the passwords do not match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await fillForm(user, { ...validData, confirmPassword: "otra123" });
    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    expect(
      await screen.findByText("Las contraseñas no coinciden")
    ).toBeInTheDocument();
  });

  it("shows every required field error when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: "Registrarse" }));

    expect(await screen.findAllByText("Ingresa un correo electrónico válido")).toHaveLength(1);
    expect(
      screen.getByText("El nombre debe tener al menos 3 caracteres")
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("La contraseña debe tener al menos 6 caracteres")
    ).toHaveLength(2);
  });
});

describe("RegisterView", () => {
  it("renders the register form", () => {
    render(<RegisterView />);

    expect(
      screen.getByRole("heading", { name: "Registro" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Registrarse" })
    ).toBeInTheDocument();
  });
});
