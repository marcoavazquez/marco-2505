import type { Response as ServiceResponse } from "@/types";
import { DepositDto } from "../dtos";
import { DepositResponseData } from "../types";
import { authSession } from "@/lib/session";
import { userBalanceRepository } from "@/lib/db/balance";
import { depositRepository } from "@/lib/db/deposit";

const MISSING_API_URL = "La pasarela de pagos no está configurada";
const NETWORK_ERROR = "No se pudo conectar con la pasarela de pagos";
const UNEXPECTED_ERROR = "Ocurrió un error al procesar el depósito";
const CARD_REJECTED = "La tarjeta fue rechazada";

const depositsUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;

  return `${apiUrl.replace(/\/+$/, "")}/snailpay/pay`;
};

const failHeader = (): Record<string, string> => {
  const search = new URLSearchParams(window.location.search);

  return search.get("fail") === "true" ? { "x-fail": "true" } : {};
};

export const depositService = {

  async deposit(data: DepositDto): Promise<ServiceResponse<DepositResponseData>> {
    const url = depositsUrl();
    const user = authSession.get();

    if (!url) {
      return {
        success: false,
        data: null,
        message: MISSING_API_URL,
        errors: { general: [MISSING_API_URL] },
      };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...failHeader() },
        body: JSON.stringify({
          ...data,
          playerId: user?.id,
          playerEmail: user?.email
        }),
      });

      const responseData = (await response
        .json()
        .catch(() => null)) as DepositResponseData | null;

      if (response.status >= 400 && response.status < 500) {
        const fieldErrors = responseData?.errors ?? responseData?.status_details;
        const message =
          responseData?.status ??
          (response.status === 402 ? CARD_REJECTED : UNEXPECTED_ERROR);

        return {
          success: false,
          data: null,
          message,
          errors: fieldErrors ?? { general: [message] },
        };
      }

      if (!response.ok) {
        return {
          success: false,
          data: null,
          message: responseData?.status ?? UNEXPECTED_ERROR,
          errors: { general: [UNEXPECTED_ERROR] },
        };
      }

      userBalanceRepository.deposit(user?.email!, data.transactionAmount);
      depositRepository.saveDeposit(user?.email!, data.transactionAmount, data.cvv, data.cardNumber);

      return {
        success: true,
        data: responseData!,
        message: "¡Depósito realizado exitosamente!",
      };
    } catch {
      return {
        success: false,
        data: null,
        message: NETWORK_ERROR,
        errors: { general: [NETWORK_ERROR] },
      };
    }
  },
};
