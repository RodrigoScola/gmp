import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../shared/src/types/supabasetypes";
export const db = createClient<Database>(
     "https://brsfrijbozerkujiiiac.supabase.co",
     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyc2ZyaWpib3plcmt1amlpaWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1MTk4NjAsImV4cCI6MjAwMDA5NTg2MH0.WW-GKpOgcBIRkESNelOKJaUcSFQbqDcxej2rohAfsEg",
     {
          auth: {
               autoRefreshToken: false,
               persistSession: false,
               detectSessionInUrl: false,
          },
     }
);
