export type OperationStatus = 'success' | 'error' | 'rejected';

export interface OperationResult<T> {
  id: string
  transaction_amount: number | null
  reference: string | null
  player_id: string | null
  player_email: string | null
  status: OperationStatus;
  status_details: T;
  authorization_code?: string | null;
  date_created: string
}