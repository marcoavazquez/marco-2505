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

    if (result.status >= 400 && result.status < 500) {
      const fieldErrors = responseData?.errors ?? responseData?.status_details;
      const message =
        responseData?.status ??
        (result.status === 402 ? CARD_REJECTED : UNEXPECTED_ERROR);

      return {
        success: false,
        data: null,
        message,
        errors: fieldErrors ?? { general: [message] },
      };
    }

    if (!result.ok) {
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
  },
};
