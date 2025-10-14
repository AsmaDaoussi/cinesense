import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number) => void;
  clear: () => void;
};
const KEY = "cinesense:faves:v1";
const FavesContext = createContext<Ctx | null>(null);

export function FavesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  // init depuis localStorage (une seule fois)
  useEffect(() => {
    try { setIds(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {}
  }, []);

  // persistance
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const has = (id: number) => ids.includes(id);
  const toggle = (id: number) =>
    setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const clear = () => setIds([]);

  const value = useMemo(() => ({ ids, has, toggle, clear }), [ids]);
  return <FavesContext.Provider value={value}>{children}</FavesContext.Provider>;
}

export function useFaves() {
  const ctx = useContext(FavesContext);
  if (!ctx) throw new Error("useFaves must be used within FavesProvider");
  return ctx;
}
