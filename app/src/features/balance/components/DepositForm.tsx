"use client";

import { useCallback, useActionState, useEffect, useRef, useState } from "react";
import { Alert, Button, Input, PasswordInput, Snackbar, TextInput } from "@/components/ui";
import { depositAction } from "../actions/deposit.action";
import { DepositDto } from "../dtos";
import { DepositFormState } from "../types";

const VALIDATION_ERROR = "Revisa los campos del formulario";

const initialState: DepositFormState = {
  data: {
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    name: "",
    transactionAmount: 0,
  },
  success: false,
  errors: {}
};

const clearedValues = {
  cardNumber: "",
  expirationDate: "",
  cvv: "",
  name: "",
  transactionAmount: "",
};

const FIELD_KEYS = new Set<keyof DepositDto>([
  "cardNumber",
  "expirationDate",
  "cvv",
  "name",
  "transactionAmount",
]);

const failureMessage = (state: DepositFormState): string | null => {
  if (state.success) return null;

  const errors = state.errors ?? {};
  const general = Object.entries(errors).find(
    ([key]) => !FIELD_KEYS.has(key as keyof DepositDto)
  );
  const hasFieldErrors = Object.keys(errors).some((key) =>
    FIELD_KEYS.has(key as keyof DepositDto)
  );

  return general?.[1][0] ?? (hasFieldErrors ? VALIDATION_ERROR : null);
};

interface Props {
  onSuccess?: (deposit: DepositDto, message?: string) => void;
}

export function DepositForm({ onSuccess }: Props) {
  const [state, formAction, isPending] = useActionState(depositAction, initialState);
  const [prevState, setPrevState] = useState(state);
  const [isDismissed, setIsDismissed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const dismissNotification = useCallback(() => setIsDismissed(true), []);

  if (prevState !== state) {
    setPrevState(state);
    setIsDismissed(false);
  }

  useEffect(() => {
    if (!state.success) return;

    formRef.current?.reset();
    onSuccess?.(state.data, state.message);
  }, [state, onSuccess]);

  const errorMessage = failureMessage(state);
  const notification = isDismissed ? null : errorMessage;

  const helperText = (field: keyof DepositDto) => state.errors?.[field]?.join(", ");
  const hasError = (field: keyof DepositDto) => Boolean(state.errors?.[field]);

  const defaults = state.success ? clearedValues : state.data;

  return (
    <form ref={formRef} action={formAction} className="space-y-4" noValidate>

      <Alert message={errorMessage} />

      <Snackbar
        message={notification}
        variant="danger"
        onClose={dismissNotification}
      />

      <TextInput
        id="cardNumber"
        name="cardNumber"
        label="Número de tarjeta"
        autoComplete="cc-number"
        inputMode="numeric"
        placeholder="4242 4242 4242 4242"
        maxLength={19}
        defaultValue={defaults.cardNumber}
        disabled={isPending}
        helperText={helperText("cardNumber")}
        hasError={hasError("cardNumber")}
      />

      <TextInput
        id="expirationDate"
        name="expirationDate"
        label="Fecha de expiración"
        autoComplete="cc-exp"
        inputMode="numeric"
        placeholder="MM/AA"
        maxLength={5}
        defaultValue={defaults.expirationDate}
        disabled={isPending}
        helperText={helperText("expirationDate")}
        hasError={hasError("expirationDate")}
      />

      <PasswordInput
        id="cvv"
        name="cvv"
        label="CVV"
        autoComplete="cc-csc"
        inputMode="numeric"
        placeholder="123"
        maxLength={4}
        defaultValue={defaults.cvv}
        disabled={isPending}
        helperText={helperText("cvv")}
        hasError={hasError("cvv")}
      />

      <TextInput
        id="name"
        name="name"
        label="Nombre en la tarjeta"
        autoComplete="cc-name"
        defaultValue={defaults.name}
        disabled={isPending}
        helperText={helperText("name")}
        hasError={hasError("name")}
      />

      <Input
        id="amount"
        name="amount"
        type="number"
        label="Monto"
        autoComplete="off"
        min={1}
        step="0.01"
        placeholder="500"
        defaultValue={defaults.transactionAmount}
        disabled={isPending}
        helperText={helperText("transactionAmount")}
        hasError={hasError("transactionAmount")}
      />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Depositando..." : "Depositar"}
      </Button>
    </form>
  );
}
