"use client";

import { FriendsTab } from "@/Components/tabs/FriendsTab";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useUser } from "@/hooks/useUser";
import { ChildrenType } from "@/types";
import { useEffect } from "react";

export default function PLLP({ children }: { children: ChildrenType }) {
     useProtectedRoute();

     const { user, getFriends, friends } = useUser();

     useEffect(() => {
          if (user?.id) {
               getFriends();
          }
     }, [user?.id]);

     return (
          <div className="flex flex-row gap-2">
               {children}

               <FriendsTab friends={friends} />
          </div>
     );
}
