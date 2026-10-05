import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../components/ui";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Registrarse</Button>);

    expect(screen.getByRole("button", { name: "Registrarse" })).toBeInTheDocument();
  });

  it("renders any react node as children", () => {
    render(
      <Button>
        <span data-testid="icon">*</span>
        Guardar
      </Button>
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Guardar");
  });

  it("renders as a solid primary medium button by default", () => {
    render(<Button>Registrarse</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("bg-primary", "text-primary-foreground", "h-10", "text-sm");
    expect(button).toHaveClass("border-transparent");
  });

  it.each([
    ["sm", "h-8"],
    ["md", "h-10"],
    ["lg", "h-12"],
  ] as const)("applies the %s size", (size, expected) => {
    render(<Button size={size}>Registrarse</Button>);

    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it.each([
    ["solid", "bg-primary"],
    ["outlined", "border-primary"],
    ["ghost", "hover:bg-primary/10"],
  ] as const)("applies the %s variant", (variant, expected) => {
    render(<Button variant={variant}>Registrarse</Button>);

    const button = screen.getByRole("button");

    expect(button).toHaveClass(expected);

    if (variant === "ghost") {
      expect(button).toHaveClass("bg-transparent");
    }
  });

  it.each([
    ["primary", "bg-primary"],
    ["secondary", "bg-secondary"],
    ["default", "bg-default"],
    ["danger", "bg-danger"],
  ] as const)("applies the %s color", (color, expected) => {
    render(<Button color={color}>Registrarse</Button>);

    expect(screen.getByRole("button")).toHaveClass(expected);
  });

  it("pairs each color with its foreground color", () => {
    const { rerender } = render(<Button color="danger">Eliminar</Button>);

    expect(screen.getByRole("button")).toHaveClass(
      "bg-danger",
      "text-danger-foreground"
    );

    rerender(
      <Button color="secondary" variant="outlined">
        Eliminar
      </Button>
    );

    expect(screen.getByRole("button")).toHaveClass(
      "border-secondary",
      "text-secondary"
    );
  });

  it("forwards the native button props", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button type="submit" disabled onClick={onClick} aria-label="Enviar">
        Enviar
      </Button>
    );

    const button = screen.getByRole("button", { name: "Enviar" });

    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onClick when enabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Registrarse</Button>);
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("merges a custom className", () => {
    render(<Button className="w-full">Registrarse</Button>);

    expect(screen.getByRole("button")).toHaveClass("w-full", "bg-primary");
  });
});
