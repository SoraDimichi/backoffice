import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Revenue } from "./types";
import { Chart } from "./chart";
import { Progress } from "@/components/ui/progress";

export type Response = PostgrestSingleResponse<Revenue>;

const Dashboards = () => {
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.rpc("get_revenue_current_week"),
      supabase.rpc("get_revenue_current_month"),
    ]).then(setResponses);
  }, []);

  console.log(responses);

  if (!responses.length) return <Progress />;

  return responses.map((data) => <Chart {...data} />);
};

export const Dashboard = () => {
  return (
    <div className="min-h-dvh grid grid-rows-[min-content_1fr]">
      <Header />
      <div className="flex  justify-center items-center gap-[30px] min-h-full">
        <Dashboards />
      </div>
    </div>
  );
};
