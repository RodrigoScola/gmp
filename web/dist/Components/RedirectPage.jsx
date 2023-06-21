"use client";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
export const RedirectPage = () => {
    const [redirecting, _] = useState(false);
    const handleClick = () => {
        if (redirecting == true)
            return;
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    };
    return (<div>
      <Button onClick={handleClick}>
        {redirecting == true
            ? "Redirecting..."
            : "Click me to redirect to the front page"}
      </Button>
    </div>);
};
