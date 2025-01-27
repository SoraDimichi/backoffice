import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

const transactions = [
  {
    user_id: "293d204f-47cf-4a76-8184-e3230ea7b679",
    description: "Salary deposit for September",
    type: "deposit",
    subtype: "salary",
    amount: 5000.0,
    status: "completed",
  },
];

async function insertTransactions() {
  const { data, error } = await supabase.from("transactions").insert(
    transactions.map((tx) => ({
      id: crypto.randomUUID(),
      ...tx,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })),
  );

  if (error) {
    console.error("Error inserting transactions:", error);
  } else {
    console.log("Inserted transactions:", data);
  }
}

export const Logout = () => <Button onClick={insertTransactions} />;
