"use client";

import { baseUrl } from "@/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useEventCallback, useUpdateEffect } from "usehooks-ts";
export type RefetchConfig = {
  persistent: boolean;
};

export function useRefetch<T extends {}>(
  url: string,
  options: RequestInit = {}
): {
  data: T | null;
} {
  let [currentUrl, setCurrentUrl] = useState("");
  const [data, setData] = useState<T | null>(null);
  const go = useCallback(async (url: string) => {
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
