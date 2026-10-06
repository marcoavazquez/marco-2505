import { FormState } from "@/types";
import { DepositDto } from "../dtos";

export type DepositFormState = FormState<DepositDto>;

export type DepositResponseData = {
  id: string;
  status_details: Record<string, string[]> | { field: string; message: string }[];
  errors?: Record<string, string[]>;
  transaction_amount: number | null;
  date_created: string;
  reference: string | null;
  player_id: string | null;
  player_email: string | null;
  status: string;
  authorization_code: string | null;
}

export type SnailPayResult =
  | { configured: false }
  | { configured: true; networkError: true }
  | {
      configured: true;
      networkError: false;
      ok: boolean;
      status: number;
      body: DepositResponseData | null;
    };
