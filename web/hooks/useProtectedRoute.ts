import { useEffect } from "react";
import { useUser } from "./useUser";

export const useProtectedRoute = () => {
     const { user, isLoggedIn } = useUser();

     useEffect(() => {
          if (isLoggedIn == false) {
               window.location.href = "/login";
          }
     }, [user, isLoggedIn]);
};
