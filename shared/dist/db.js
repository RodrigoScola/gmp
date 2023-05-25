"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
exports.db = (0, supabase_js_1.createClient)("https://brsfrijbozerkujiiiac.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyc2ZyaWpib3plcmt1amlpaWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ1MTk4NjAsImV4cCI6MjAwMDA5NTg2MH0.WW-GKpOgcBIRkESNelOKJaUcSFQbqDcxej2rohAfsEg");
