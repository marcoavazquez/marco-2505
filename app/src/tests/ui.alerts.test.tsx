import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alerts } from "../components/ui";

describe("Alerts", () => {
  it("renders nothing when there are no messages", () => {
    const { container } = render(<Alerts messages={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows every message as an alert", () => {
    render(
      <Alerts
        messages={["No se pudo conectar con la pasarela de pagos", "Revisa los datos"]}
      />
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("No se pudo conectar con la pasarela de pagos");
    expect(alert).toHaveTextContent("Revisa los datos");
  });

  it("shows success messages as a status instead of an alert", () => {
    render(<Alerts messages={["¡Depósito realizado exitosamente!"]} variant="success" />);

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("¡Depósito realizado exitosamente!");
    expect(status).toHaveClass("text-success");
  });

  it("forwards the extra props to the alert element", () => {
    render(<Alerts messages={["Error"]} className="mt-4" data-testid="alerts" />);

    expect(screen.getByTestId("alerts")).toHaveClass("mt-4");
  });
});
