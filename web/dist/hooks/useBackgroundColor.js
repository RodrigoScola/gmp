"use client";
import { useEffect, useState } from "react";
import { useEffectOnce } from "usehooks-ts";
const defaultIntialColor = "bg-gray-600";
export const useBackgroundColor = (initialColor) => {
    const [bgColor, setBgColor] = useState(document
        .getElementsByTagName("body")[0]
        .className.split(" ")
        .filter((x) => x.startsWith("bg-"))[0] || defaultIntialColor);
    useEffectOnce(() => {
        if (initialColor) {
            changeBackgroundColor(initialColor);
        }
    });
    useEffect(() => {
        return () => {
            console.log("unmounting background color");
            changeBackgroundColor(defaultIntialColor);
        };
    }, []);
    const changeBackgroundColor = (color) => {
        const [body] = document.getElementsByTagName("body");
        body.className = body.className.replace(bgColor, color);
        setBgColor(color);
    };
    return {
        bgColor,
        changeBackgroundColor,
    };
};
