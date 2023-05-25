/// <reference types="react" />
import { Session } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../shared/src/types/supabasetypes";
type MaybeSession = Session | null;
type SupabaseContext = {
    supabase: SupabaseClient<Database>;
    session: MaybeSession;
};
export default function SupabaseProvider({ children, }: {
    children: React.ReactNode;
}): JSX.Element;
export declare const useSupabase: () => SupabaseContext;
export {};
//# sourceMappingURL=supabase-provider.d.ts.map