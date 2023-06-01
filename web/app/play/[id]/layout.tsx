"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ChildrenType } from "@/types";
import { useProgressStyles } from "@chakra-ui/react";

export default function PLAYLAYOUT({ children }: { children: ChildrenType }) {
     useProtectedRoute();
     return <div>{children}</div>;
}
