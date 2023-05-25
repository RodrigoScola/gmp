"use client";
import { baseUrl } from "@/constants";
import { useCallback, useState } from "react";
import { useUpdateEffect } from "usehooks-ts";
export function useRefetch(url, options = {}) {
    let [currentUrl, setCurrentUrl] = useState("");
    const [data, setData] = useState(null);
    const go = useCallback(async (url) => {
        const nurl = url.startsWith("http") ? url : baseUrl + url;
        const d = await fetch(nurl, options);
        const jd = await d.json();
        setData(jd);
        setCurrentUrl(url);
    }, []);
    useUpdateEffect(() => {
        if (JSON.stringify(currentUrl) !== JSON.stringify(url)) {
            go(url);
        }
    }, [url]);
    return {
        data,
    };
}
