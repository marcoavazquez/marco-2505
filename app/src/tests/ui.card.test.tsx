import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../components/ui";

describe("Card", () => {
  it("renders its children", () => {
    render(
      <Card>
        <p>Contenido</p>
      </Card>
    );

    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("renders a bordered surface as its container", () => {
    const { container } = render(<Card>Contenido</Card>);

    expect(container.firstElementChild).toHaveClass(
      "rounded-lg",
      "border",
      "bg-background"
    );
  });

  it("renders no heading when no title is given", () => {
    render(<Card>Contenido</Card>);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders the title and description", () => {
    render(
      <Card title="Balance de apuestas" description="32 MXN disponibles">
        <p>Contenido</p>
      </Card>
    );

    expect(screen.getByRole("heading", { name: "Balance de apuestas" })).toBeInTheDocument();
    expect(screen.getByText("32 MXN disponibles")).toBeInTheDocument();
  });

  it("renders a description without a title", () => {
    render(<Card description="32 MXN disponibles">Contenido</Card>);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("32 MXN disponibles")).toBeInTheDocument();
  });

  it("renders the title as an h2 by default", () => {
    render(<Card title="Carreras del día">Contenido</Card>);

    expect(screen.getByRole("heading", { name: "Carreras del día" }).tagName).toBe("H2");
  });

  it.each(["h1", "h2", "h3", "h4"] as const)(
    "renders the title as a %s when asked",
    (titleLevel) => {
      render(
        <Card title="Registro" titleLevel={titleLevel}>
          Contenido
        </Card>
      );

      expect(screen.getByRole("heading", { name: "Registro" }).tagName).toBe(
        titleLevel.toUpperCase()
      );
    }
  );

  it("renders the title aligned to the left by default", () => {
    render(<Card title="Carreras del día">Contenido</Card>);

    expect(screen.getByRole("heading", { name: "Carreras del día" })).toHaveClass("text-left");
  });

  it("centers the title when asked", () => {
    render(
      <Card title="Iniciar Sesión" titleAlign="center">
        Contenido
      </Card>
    );

    expect(screen.getByRole("heading", { name: "Iniciar Sesión" })).toHaveClass("text-center");
  });

  it("merges a custom className", () => {
    const { container } = render(<Card className="w-full max-w-sm">Contenido</Card>);

    expect(container.firstElementChild).toHaveClass("w-full", "max-w-sm", "bg-background");
  });

  it("forwards the native div props", () => {
    const { container } = render(
      <Card id="resumen" aria-label="Resumen de apuestas">
        Contenido
      </Card>
    );

    expect(container.firstElementChild).toHaveAttribute("id", "resumen");
    expect(screen.getByLabelText("Resumen de apuestas")).toBeInTheDocument();
  });
});
