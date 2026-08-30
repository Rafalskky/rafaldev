"use client";
import { TransitionProvider } from "./TransitionContext";
import Navbar from "./Navbar";

export default function ClientLayout({ children }) {
  return (
    <TransitionProvider>
      <Navbar />
      {children}
    </TransitionProvider>
  );
}
