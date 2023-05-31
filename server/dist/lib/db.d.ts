import { Database } from "../../../shared/src/types/supabasetypes";
export declare const db: import("@supabase/supabase-js").SupabaseClient<Database, "public", {
    Tables: {
        connections: {
            Row: {
                created_at: string;
                friend1: string;
                friend2: string;
                id: number;
                status: string;
            };
            Insert: {
                created_at?: string | undefined;
                friend1: string;
                friend2: string;
                id?: number | undefined;
                status?: string | undefined;
            };
            Update: {
                created_at?: string | undefined;
                friend1?: string | undefined;
                friend2?: string | undefined;
                id?: number | undefined;
                status?: string | undefined;
            };
        };
        conversations: {
            Row: {
                created_at: string | null;
                id: number;
                user1: string;
                user2: string;
            };
            Insert: {
                created_at?: string | null | undefined;
                id?: number | undefined;
                user1: string;
                user2: string;
            };
            Update: {
                created_at?: string | null | undefined;
                id?: number | undefined;
                user1?: string | undefined;
                user2?: string | undefined;
            };
        };
        messages: {
            Row: {
                conversationId: number;
                created: string;
                id: string;
                message: string;
                userId: string;
            };
            Insert: {
                conversationId: number;
                created?: string | undefined;
                id?: string | undefined;
                message: string;
                userId: string;
            };
            Update: {
                conversationId?: number | undefined;
                created?: string | undefined;
                id?: string | undefined;
                message?: string | undefined;
                userId?: string | undefined;
            };
        };
        profiles: {
            Row: {
                created_at: string;
                email: string;
                id: string;
                username: string;
            };
            Insert: {
                created_at?: string | undefined;
                email: string;
                id: string;
                username: string;
            };
            Update: {
                created_at?: string | undefined;
                email?: string | undefined;
                id?: string | undefined;
                username?: string | undefined;
            };
        };
    };
    Views: {};
    Functions: {
        find_conversation: {
            Args: {
                user1_id: string;
                user2_id: string;
            };
            Returns: {
                user1: string;
                user2: string;
                id: number;
            }[];
        };
        find_matching_rows: {
            Args: {
                user1_id: string;
                user2_id: string;
            };
            Returns: {
                friend1_id: string;
                friend2_id: string;
                id: number;
                status: string;
            }[];
        };
        get_friends: {
            Args: {
                userid: string;
            };
            Returns: string[];
        };
    };
    Enums: {};
    CompositeTypes: {};
}>;
