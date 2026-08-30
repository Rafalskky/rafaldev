"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const TransitionContext = createContext();

export const useTransition = () => useContext(TransitionContext);

export const TransitionProvider = ({ children }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [showChrome, setShowChrome] = useState(false);
  const router = useRouter();

  const navigate = useCallback((href) => {
    setIsExiting(true);
    setShowChrome(false);
    setTimeout(() => {
      router.push(href);
      setIsExiting(false);
    }, 2200);
  }, [router]);

  return (
    <TransitionContext.Provider value={{ isExiting, navigate, showChrome, setShowChrome }}>
      {children}
    </TransitionContext.Provider>
  );
};
