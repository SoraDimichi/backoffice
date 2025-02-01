export type RevenueSubtype = { subtype: string; revenue: number };
export type Revenue = {
  type: string;
  range: string;
  total: number;
  revenues: RevenueSubtype[];
};
