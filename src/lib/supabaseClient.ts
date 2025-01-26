import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://huwxixuuiftdknprkzjp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1d3hpeHV1aWZ0ZGtucHJrempwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MjIyMjYsImV4cCI6MjA1MzM5ODIyNn0.hUpeSblZu7OC2vpTlElCQiExN9mc5ff_TOvKLEjCpNs",
);
