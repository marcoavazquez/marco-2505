import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Snackbar } from "../components/ui";

afterEach(() => {
  vi.useRealTimers();
});

describe("Snackbar", () => {
  it("renders nothing while there is no message", () => {
    const { container } = render(<Snackbar message={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows a success message as a status", () => {
    render(
      <Snackbar
        message="¡Depósito realizado exitosamente!"
        variant="success"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "¡Depósito realizado exitosamente!"
    );
  });

  it("shows an error message as an alert", () => {
    render(
      <Snackbar
        message="La tarjeta fue rechazada"
        variant="danger"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "La tarjeta fue rechazada"
    );
  });

  it("closes when its close button is pressed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Snackbar message="Listo" onClose={onClose} />);

    await user.click(
      screen.getByRole("button", { name: "Cerrar notificación" })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on its own once its duration has passed", () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Snackbar message="Listo" duration={3000} onClose={onClose} />);

    act(() => vi.advanceTimersByTime(2999));
    expect(onClose).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
