import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  EmailInput,
  Input,
  PasswordInput,
  TextInput,
} from "../components/ui";

describe("Input", () => {
  it("associates the label with the input", () => {
    render(<Input label="Nombre completo" name="fullName" />);

    expect(screen.getByLabelText("Nombre completo")).toHaveAttribute(
      "name",
      "fullName"
    );
  });

  it("uses the given id for the label association", () => {
    render(<Input id="custom-id" label="Nombre completo" />);

    expect(screen.getByLabelText("Nombre completo")).toHaveAttribute(
      "id",
      "custom-id"
    );
  });

  it("forwards the native input props", () => {
    render(
      <Input
        label="Nombre completo"
        name="fullName"
        placeholder="Ana Martínez"
        disabled
        required
        defaultValue="Ana"
      />
    );

    const input = screen.getByLabelText("Nombre completo");

    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("placeholder", "Ana Martínez");
    expect(input).toHaveValue("Ana");
  });

  it("renders the helper text below the input", () => {
    render(<Input label="Correo electrónico" helperText="Usaremos tu correo" />);

    expect(screen.getByText("Usaremos tu correo")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toHaveAccessibleDescription(
      "Usaremos tu correo"
    );
  });

  it("does not render a helper text element when it is not provided", () => {
    render(<Input label="Correo electrónico" />);

    expect(screen.getByLabelText("Correo electrónico")).not.toHaveAttribute(
      "aria-describedby"
    );
  });

  it("keeps the helper text neutral when there is no error", () => {
    render(<Input label="Contraseña" helperText="Mínimo 6 caracteres" />);

    expect(screen.getByText("Mínimo 6 caracteres")).not.toHaveClass("text-danger");
  });

  it("colors the helper text as danger when hasError is true", () => {
    render(
      <Input
        label="Contraseña"
        helperText="La contraseña debe tener al menos 6 caracteres"
        hasError
      />
    );

    expect(
      screen.getByText("La contraseña debe tener al menos 6 caracteres")
    ).toHaveClass("text-danger");
  });

  it("marks the input as invalid when hasError is true", () => {
    const { rerender } = render(
      <Input label="Contraseña" helperText="Muy corta" hasError />
    );

    expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    rerender(<Input label="Contraseña" helperText="Muy corta" />);

    expect(screen.getByLabelText("Contraseña")).not.toHaveAttribute(
      "aria-invalid"
    );
  });
});

describe("TextInput", () => {
  it("renders a text input", () => {
    render(<TextInput label="Nombre completo" name="fullName" />);

    expect(screen.getByLabelText("Nombre completo")).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("supports helper text and errors", () => {
    render(
      <TextInput
        label="Nombre completo"
        helperText="El nombre debe tener al menos 3 caracteres"
        hasError
      />
    );

    expect(
      screen.getByText("El nombre debe tener al menos 3 caracteres")
    ).toHaveClass("text-danger");
  });
});

describe("EmailInput", () => {
  it("renders an email input", () => {
    render(<EmailInput label="Correo electrónico" name="email" />);

    expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute(
      "type",
      "email"
    );
  });
});

describe("PasswordInput", () => {
  it("renders a password input that hides the value", () => {
    render(<PasswordInput label="Contraseña" name="password" defaultValue="secret123" />);

    const input = screen.getByLabelText("Contraseña");

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("secret123");
  });
});
