"use client";
import { createBrowserSupabaseClient, } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
const Context = createContext(undefined);
export default function SupabaseProvider({ children, }) {
    const [supabase] = useState(() => createBrowserSupabaseClient());
    const router = useRouter();
    const [session, setSession] = useState(null);
    const h = async () => {
        const data = await supabase.auth.getSession();
        if ("session" in data.data) {
            setSession(data.data.session);
        }
    };
    useUpdateEffect(() => {
        if (!session) {
            h();
        }
    }, [supabase]);
    useEffect(() => {
        const { data: { subscription }, } = supabase.auth.onAuthStateChange((eventType, session) => {
            console.log(eventType);
            console.log(session);
            if (eventType == "SIGNED_OUT") {
                setSession(null);
            }
            else {
                setSession(session);
            }
            router.refresh();
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);
    return (<Context.Provider value={{ supabase, session }}>
               {children}
          </Context.Provider>);
}
export const useSupabase = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("useSupabase must be used inside SupabaseProvider");
    }
    return context;
};
