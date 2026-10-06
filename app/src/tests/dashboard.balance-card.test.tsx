import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BalanceCard } from "../features/dashboard/components/BalanceCard";
import { Balance } from "@/types/balance";

const balance: Balance = {
  userEmail: "ana@example.com",
  amount: 0,
  won: 0,
  lost: 0,
};

const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Depositar saldo" }));

  return screen.findByRole("dialog");
};

const receipt = { id: "dep_1", amount: 500, status: "approved" };

const mockGateway = (body: unknown, status = 200) => {
  vi.mocked(fetch).mockImplementation(() =>
    Promise.resolve(new Response(JSON.stringify(body), { status }))
  );
};

const fillAndSubmit = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("Número de tarjeta"), "4242424242424242");
  await user.type(screen.getByLabelText("Fecha de expiración"), "12/30");
  await user.type(screen.getByLabelText("CVV"), "123");
  await user.type(screen.getByLabelText("Nombre en la tarjeta"), "Ana Martínez");
  await user.type(screen.getByLabelText("Monto"), "500");
  await user.click(screen.getByRole("button", { name: "Depositar" }));
};

const findSnackbar = async () => {
  const closeButton = await screen.findByRole("button", {
    name: "Cerrar notificación",
  });
  const snackbar = closeButton.closest('[role="alert"]');

  if (!(snackbar instanceof HTMLElement)) {
    throw new Error("Snackbar alert was not found");
  }

  return snackbar;
};

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  mockGateway(receipt);
});

describe("BalanceCard", () => {
  it("shows the available balance", () => {
    render(<BalanceCard balance={balance} />);

    expect(screen.getByText("Saldo disponible")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("hides the deposit form until the dialog is opened", () => {
    render(<BalanceCard balance={balance} />);

    expect(screen.queryByLabelText("Número de tarjeta")).not.toBeVisible();
  });

  it("opens the deposit form in a dialog", async () => {
    const user = userEvent.setup();
    render(<BalanceCard balance={balance} />);

    expect(await openDialog(user)).toBeVisible();
    expect(screen.getByLabelText("Número de tarjeta")).toBeVisible();
    expect(screen.getByLabelText("Monto")).toBeVisible();
  });

  it("deposits the accepted amount and closes the dialog", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    const onDeposit = vi.fn();
    const user = userEvent.setup();
    render(<BalanceCard balance={balance} onDeposit={onDeposit} />);

    await openDialog(user);

    await fillAndSubmit(user);

    await waitFor(() => expect(onDeposit).toHaveBeenCalledWith(500));
    await waitFor(() =>
      expect(screen.queryByLabelText("Número de tarjeta")).not.toBeVisible()
    );
  });

  it("keeps the dialog open when the deposit fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    mockGateway({}, 402);

    const onDeposit = vi.fn();
    const user = userEvent.setup();
    render(<BalanceCard balance={balance} onDeposit={onDeposit} />);

    await openDialog(user);

    await fillAndSubmit(user);

    expect((await screen.findAllByText("La tarjeta fue rechazada"))[0]).toBeVisible();
    expect(onDeposit).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Número de tarjeta")).toBeVisible();
  });

  it("shows a success snackbar once the accepted deposit closes the dialog", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    const user = userEvent.setup();
    render(<BalanceCard balance={balance} />);

    await openDialog(user);
    await fillAndSubmit(user);

    const snackbar = await screen.findByRole("status");

    expect(snackbar).toHaveTextContent("¡Depósito realizado exitosamente!");
    expect(
      within(snackbar).getByRole("button", { name: "Cerrar notificación" })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Número de tarjeta")).not.toBeVisible();
  });

  it("shows an error snackbar while the dialog stays open", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    mockGateway({}, 402);

    const user = userEvent.setup();
    render(<BalanceCard balance={balance} />);

    await openDialog(user);
    await fillAndSubmit(user);

    const snackbar = await findSnackbar();

    expect(snackbar).toHaveTextContent("La tarjeta fue rechazada");
    expect(
      within(snackbar).getByRole("button", { name: "Cerrar notificación" })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Número de tarjeta")).toBeVisible();
  });
});
