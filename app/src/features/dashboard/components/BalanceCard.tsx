"use client";

import { useCallback, useState } from "react";
import { Balance } from "@/types/balance";
import { Button, Dialog, Snackbar } from "@/components/ui";
import { DepositDto, DepositForm } from "@/features/balance";

interface Props {
  balance: Balance
  onDeposit?: (amount: number) => void
}

export const BalanceCard = ({ balance, onDeposit }: Props) => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const handleDeposit = useCallback(
    (deposit: DepositDto, message?: string) => {
      onDeposit?.(deposit.transactionAmount)
      setIsDepositOpen(false)
      setSnackbar(message ?? null)
    },
    [onDeposit]
  );

  const dismissSnackbar = useCallback(() => setSnackbar(null), []);

  return (
    <div className="flex w-full shrink-0 flex-col gap-1 rounded-lg border border-border border-t-4 border-t-primary bg-background p-5 shadow-sm lg:w-64">
      <p className="text-sm font-medium text-secondary">
        Saldo disponible
      </p>
      <p className="text-3xl font-bold tabular-nums text-primary text-right">
        $ {balance?.amount.toFixed(2) ?? "0.00"}
      </p>

      <Button
        size="sm"
        className="mt-3 w-full"
        onClick={() => setIsDepositOpen(true)}
      >
        Depositar saldo
      </Button>

      <Dialog
        open={isDepositOpen}
        title="Depositar saldo"
        cancelText="Cancelar"
        hideFooter
        onClose={() => setIsDepositOpen(false)}
      >
        <DepositForm onSuccess={handleDeposit} />
      </Dialog>

      <Snackbar
        message={snackbar}
        variant="success"
        onClose={dismissSnackbar}
      />
    </div>
  )
}
