"use client";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
export default function TESTLAYOUT({ children }) {
    useProtectedRoute();
    return <div>{children}</div>;
}
