"use client";

import { balanceService } from "@/services/balance.service";
import { Balance } from "@/types/balance";
import { useCallback, useEffect, useState } from "react";

export const useBalance = (userEmail: string) => {
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    const storedBalance = balanceService.getBalance(userEmail);
    setBalance(storedBalance);
  }, [userEmail]);

  const deposit = useCallback((amount: number) => {
    setBalance(balanceService.getBalance(userEmail));
  }, [userEmail]);

  const withdraw = useCallback((amount: number) => {
    setBalance(balanceService.getBalance(userEmail));
  }, [userEmail]);

  return {
    balance,
    deposit,
    withdraw,
  };
};
