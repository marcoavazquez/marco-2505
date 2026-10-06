import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DepositForm } from "../features/balance/components/DepositForm";

const validDeposit = {
  cardNumber: "4242424242424242",
  expirationDate: "12/30",
  cvv: "123",
  name: "Ana Martínez",
  email: "ana@example.com",
  amount: "500",
};

const receipt = { id: "dep_1", amount: 500, status: "approved" };

const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  values: Partial<typeof validDeposit> = validDeposit
) => {
  if (values.cardNumber !== undefined) {
    await user.type(screen.getByLabelText("Número de tarjeta"), values.cardNumber);
  }
  if (values.expirationDate !== undefined) {
    await user.type(
      screen.getByLabelText("Fecha de expiración"),
      values.expirationDate
    );
  }
  if (values.cvv !== undefined) {
    await user.type(screen.getByLabelText("CVV"), values.cvv);
  }
  if (values.name !== undefined) {
    await user.type(screen.getByLabelText("Nombre en la tarjeta"), values.name);
  }
  if (values.amount !== undefined) {
    await user.type(screen.getByLabelText("Monto"), values.amount);
  }
};

const submit = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Depositar" }));

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

const jsonResponse = (body: unknown, status = 200) =>
  vi.mocked(fetch).mockImplementation(() =>
    Promise.resolve(new Response(JSON.stringify(body), { status }))
  );

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  window.history.replaceState({}, "", "/");
});

describe("DepositForm", () => {
  it("renders every input of the deposit form", () => {
    render(<DepositForm />);

    expect(screen.getByLabelText("Número de tarjeta")).toHaveAttribute(
      "name",
      "cardNumber"
    );
    expect(screen.getByLabelText("Fecha de expiración")).toHaveAttribute(
      "name",
      "expirationDate"
    );
    expect(screen.getByLabelText("CVV")).toHaveAttribute("name", "cvv");
    expect(screen.getByLabelText("Nombre en la tarjeta")).toHaveAttribute(
      "name",
      "name"
    );
    expect(screen.getByLabelText("Monto")).toHaveAttribute("name", "amount");
    expect(
      screen.getByRole("button", { name: "Depositar" })
    ).toBeInTheDocument();
  });

  it("sends the card data to the deposits endpoint of the api", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse(receipt);

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [url, init] = vi.mocked(fetch).mock.calls[0];

    expect(url).toBe("https://api.example.com/snailpay/pay");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      cardNumber: "4242424242424242",
      expirationDate: "12/30",
      cvv: "123",
      name: "Ana Martínez",
      transactionAmount: 500,
    });
  });

  it("adds the x-fail header when the page url has fail=true", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse(receipt);
    window.history.replaceState({}, "", "/dashboard?fail=true");

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [, init] = vi.mocked(fetch).mock.calls[0];

    expect(init?.headers).toMatchObject({ "x-fail": "true" });
  });

  it("does not add the x-fail header when the page url has no fail=true", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse(receipt);

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [, init] = vi.mocked(fetch).mock.calls[0];

    expect(init?.headers).not.toHaveProperty("x-fail");
  });

  it("notifies the parent with the accepted deposit and its message", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse(receipt);
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<DepositForm onSuccess={onSuccess} />);

    await fillForm(user);
    await submit(user);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    expect(onSuccess).toHaveBeenCalledWith(
      {
        cardNumber: "4242424242424242",
        expirationDate: "12/30",
        cvv: "123",
        name: "Ana Martínez",
        transactionAmount: 500,
      },
      "¡Depósito realizado exitosamente!"
    );
  });

  it("clears every input once the deposit is accepted", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse(receipt);

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    await waitFor(() =>
      expect(screen.getByLabelText("Número de tarjeta")).toHaveValue("")
    );
    expect(screen.getByLabelText("Monto")).toHaveValue(null);
  });

  it("does not call the api when the card number is invalid", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user, { ...validDeposit, cardNumber: "4242" });
    await submit(user);

    expect(
      await screen.findByText("El número de tarjeta debe tener 16 dígitos")
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not call the api when the amount is not positive", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user, { ...validDeposit, amount: "0" });
    await submit(user);

    expect(
      await screen.findByText("El monto debe ser mayor a 0")
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects an expired card before calling the api", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user, { ...validDeposit, expirationDate: "01/20" });
    await submit(user);

    expect(await screen.findByText("La tarjeta está expirada")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows a field error when the expiration date format is wrong", async () => {
    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user, { ...validDeposit, expirationDate: "13/30" });
    await submit(user);

    expect(
      await screen.findByText(
        "La fecha de expiración debe tener el formato MM/AA"
      )
    ).toBeInTheDocument();
  });

  it("shows a field error when the cvv is wrong", async () => {
    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user, { ...validDeposit, cvv: "12" });
    await submit(user);

    expect(
      await screen.findByText("El código de seguridad debe tener 3 o 4 dígitos")
    ).toBeInTheDocument();
  });

  it("shows the reason on the card when the gateway rejects it", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse({}, 402);

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    expect(
      (await screen.findAllByText("La tarjeta fue rechazada"))[0]
    ).toBeInTheDocument();
  });

  it("shows the gateway rejection in an inline alert while keeping the snackbar", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse({}, 402);

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    const alerts = await screen.findAllByRole("alert");

    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveTextContent("La tarjeta fue rechazada");
    expect(
      within(alerts[1]).getByRole("button", { name: "Cerrar notificación" })
    ).toBeInTheDocument();
    expect(alerts[1]).toHaveTextContent("La tarjeta fue rechazada");
  });

  it("shows the field errors sent by the gateway", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    jsonResponse({ errors: { amount: ["El monto excede el límite diario"] } }, 402);

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    expect(
      (await screen.findAllByText("El monto excede el límite diario"))[0]
    ).toBeInTheDocument();
  });

  it("falls back to a general error when the gateway answers with no body", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.mocked(fetch).mockResolvedValue(new Response("", { status: 500 }));

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    expect(
      (await screen.findAllByText("Ocurrió un error al procesar el depósito"))[0]
    ).toBeInTheDocument();
  });

  it("shows a general error when the gateway is unreachable", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.mocked(fetch).mockRejectedValue(new Error("network down"));

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    expect(
      (await screen.findAllByText("No se pudo conectar con la pasarela de pagos"))[0]
    ).toBeInTheDocument();
  });

  it("shows a general error when the api is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");

    const user = userEvent.setup();
    render(<DepositForm />);

    await fillForm(user);
    await submit(user);

    expect(
      (await screen.findAllByText("La pasarela de pagos no está configurada"))[0]
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
