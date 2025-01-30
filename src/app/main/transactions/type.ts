export enum TransactionType {
  DEPOSIT = "deposit",
  CREDIT = "credit",
}

export enum TransactionSubtype {
  REFUND = "refund",
  REWARD = "reward",
  PURCHASE = "purchase",
}

export enum TransactionStatus {
  ENDING = "ending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  type: TransactionType;
  subtype: TransactionSubtype;
  amount: number;
  status: TransactionStatus;
  created_at: Date;
  updated_at: Date;
}
