"use client";

import { useContext } from "react";
import { SomeContext } from "@/context/SomeContext";

export default function GlobalErrorPage({ error }) {
  const value = useContext(SomeContext);

  return <div>Error: {error.message}</div>;
}
