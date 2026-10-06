import type { Response as ServiceResponse } from "@/types";
import { DepositDto } from "../dtos";
import { DepositResponseData } from "../types";
import { authSession } from "@/lib/session";
import { userBalanceRepository } from "@/lib/db/balance";
import { depositRepository } from "@/lib/db/deposit";
import { snailPay } from "./snailpay.server";

const MISSING_API_URL = "La pasarela de pagos no está configurada";
const NETWORK_ERROR = "No se pudo conectar con la pasarela de pagos";
const UNEXPECTED_ERROR = "Ocurrió un error al procesar el depósito";
const CARD_REJECTED = "La tarjeta fue rechazada";
const SERVICE_UNAVAILABLE = "El servicio de pagos no está disponible. Intenta de nuevo más tarde";

const paymentErrors = (
  details: DepositResponseData["status_details"] | undefined
): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  if (Array.isArray(details)) {
    for (const { field, message } of details) {
      const key = field || "general";
      (errors[key] ??= []).push(message);
    }
  } else if (details) {
    for (const [field, messages] of Object.entries(details)) {
      errors[field === "message" ? "general" : field] = messages;
    }
  }

  return errors;
};

const failRequested = () => {
  const search = new URLSearchParams(window.location.search);

  return search.get("fail") === "true";
};

export const depositService = {

  async deposit(data: DepositDto): Promise<ServiceResponse<DepositResponseData>> {
    const user = authSession.get();

    const result = await snailPay(
      {
        ...data,
        playerId: user?.id,
        playerEmail: user?.email
      },
      { fail: failRequested() }
    );

    if (!result.configured) {
      return {
        success: false,
        data: null,
        message: MISSING_API_URL,
        errors: { general: [MISSING_API_URL] },
      };
    }

    if (result.networkError) {
      return {
        success: false,
        data: null,
        message: NETWORK_ERROR,
        errors: { general: [NETWORK_ERROR] },
      };
    }

    const responseData = result.body;

    if (!result.ok) {
      const fieldErrors = paymentErrors(responseData?.errors ?? responseData?.status_details);
      const fallback = result.status === 503
        ? SERVICE_UNAVAILABLE
        : result.status === 402 ? CARD_REJECTED : UNEXPECTED_ERROR;
      const message = fieldErrors.general?.[0] ?? fallback;

      return {
        success: false,
        data: null,
        message,
        errors: Object.keys(fieldErrors).length > 0 ? fieldErrors : { general: [message] },
      };
    }

    userBalanceRepository.deposit(user?.email!, data.transactionAmount);
    depositRepository.saveDeposit(user?.email!, data.transactionAmount, data.cvv, data.cardNumber);

    return {
      success: true,
      data: responseData!,
      message: "¡Depósito realizado exitosamente!",
    };
  },
};
