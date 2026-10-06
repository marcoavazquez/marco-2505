"use server";

import type { DepositDto } from "../dtos";
import type { DepositResponseData, SnailPayResult } from "../types";

export const snailPay = async (
  data: DepositDto & { playerId?: string; playerEmail?: string },
  options: { fail: boolean }
): Promise<SnailPayResult> => {
  const baseUrl = process.env.BACKEND_URL;

  if (!baseUrl) {
    return { configured: false };
  }

  try {
    const response = await fetch(new URL("snailpay/pay", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.fail ? { "x-fail": "true" } : {}),
      },
      body: JSON.stringify(data),
    });

    const body = (await response
      .json()
      .catch(() => null)) as DepositResponseData | null;

    return {
      configured: true,
      networkError: false,
      ok: response.ok,
      status: response.status,
      body,
    };
  } catch {
    return { configured: true, networkError: true };
  }
};
