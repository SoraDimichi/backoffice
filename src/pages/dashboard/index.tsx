import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Revenue } from "./types";
import { Chart } from "./chart";
import { Progress } from "@/components/ui/progress";
import { getRevenueCurrentMonth, getRevenueCurrentWeek } from "./api";
import { Layout, Home } from "@/components/layout";

export type Response = PostgrestSingleResponse<Revenue>;

const Dashboards = () => {
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    Promise.all([getRevenueCurrentWeek(), getRevenueCurrentMonth()]).then(
      setResponses,
    );
  }, []);

  if (!responses.length) return <Progress />;

  return responses.map((data) => <Chart {...data} />);
};

export const Dashboard = () => (
  <Layout buttons={<Home />}>
    <div className="flex  justify-center items-center gap-[30px] min-h-full">
      <Dashboards />
    </div>
  </Layout>
);
