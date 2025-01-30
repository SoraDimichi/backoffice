import { supabase } from "@/lib/supabaseClient";
import {
  Transaction,
  TransactionStatus,
  TransactionSubtype,
  TransactionType,
} from "./type";

interface GetTransactionsParams {
  page?: number;
  searchTerm?: string;
  type?: TransactionType;
  subtype?: TransactionSubtype;
  status?: TransactionStatus;
  minAmount?: number;
  maxAmount?: number;
}

export const LIMIT = 20;

type GetTransactions = (
  p: GetTransactionsParams,
) => Promise<{ data: Transaction[]; count: number }>;

export const getTransactions: GetTransactions = async (p) => {
  const {
    page = 1,
    searchTerm,
    type,
    subtype,
    status,
    minAmount,
    maxAmount,
  } = p;

  let query = supabase
    .from("transactions_with_username")
    .select("*", { count: "exact" })
    .range((page - 1) * LIMIT, (page - 1) * LIMIT + LIMIT - 1);

  if (searchTerm) {
    query = query.or(
      `description.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`,
    );
  }

  if (type) {
    query = query.eq("type", type);
  }

  if (subtype) {
    query = query.eq("subtype", subtype);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (typeof minAmount === "number") {
    query = query.gte("amount", minAmount);
  }
  if (typeof maxAmount === "number") {
    query = query.lte("amount", maxAmount);
  }

  const { data, error, count } = await query;

  if (error) throw Error(error.message);

  return { data: data ?? [], count: count ?? 0 };
};

export const getDetailedInfo = (id: string) =>
  supabase.from("transactions").select().eq("id", id);
