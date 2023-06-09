"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ChildrenType } from "@/types";

export default function TESTLAYOUT({ children }: { children: ChildrenType }) {
     useProtectedRoute();
     return <div>{children}</div>;
}
