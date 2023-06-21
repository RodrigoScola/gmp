"use client";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
export default function PLAYLAYOUT({ children }) {
    useProtectedRoute();
    return <div className="">{children}</div>;
}
