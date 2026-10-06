import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "../components/ui";

describe("Alert", () => {
  it("renders nothing when the message is empty", () => {
    const { container } = render(<Alert message={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows a danger message as an alert", () => {
    render(<Alert message="No se pudo conectar con la pasarela de pagos" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se pudo conectar con la pasarela de pagos"
    );
  });

  it("shows success messages as a status instead of an alert", () => {
    render(<Alert message="¡Depósito realizado exitosamente!" variant="success" />);

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("¡Depósito realizado exitosamente!");
    expect(status).toHaveClass("text-success");
  });

  it("forwards extra props to the alert element", () => {
    render(<Alert message="Error" className="mt-4" data-testid="alert" />);

    expect(screen.getByTestId("alert")).toHaveClass("mt-4");
  });
});
