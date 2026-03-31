"use client";

import { useEffect } from "react";

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handler = (e) => {
      if (e?.message?.includes("ChunkLoadError")) {
        console.log("Fixing chunk error by reload...");
        window.location.reload();
      }
    };

    window.addEventListener("error", handler);

    return () => {
      window.removeEventListener("error", handler);
    };
  }, []);

  return null;
}