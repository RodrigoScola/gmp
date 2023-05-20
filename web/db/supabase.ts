import { Database } from "@/supabasetypes";
import { createClient } from "@supabase/supabase-js";
export const db = createClient<Database>(
  "https://xrmhsecaqyagozphmdbv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybWhzZWNhcXlhZ296cGhtZGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1MTE3MDksImV4cCI6MjAwMDA4NzcwOX0.KQLh_MA3nIOSgFPBtqBxOV6wQ67gkJIHvaA4jynjQOA"
);
