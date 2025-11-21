"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCircleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: number;
  className?: string;
}

export const LiquidGlassCircleButton = React.forwardRef<HTMLButtonElement, LiquidGlassCircleButtonProps>
        (({ icon, size = 80, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      style={{ width: size, height: size, minWidth: size, minHeight: size}}
      className={cn(
        "rounded-full flex items-center justify-center bg-white/20 backdrop-blur-xl shadow-xl text-white transition-all active:scale-95 hover:scale-105",
        className )}
      {...props}>
      {icon}
    </button>
  );
});

LiquidGlassCircleButton.displayName = "LiquidGlassCircleButton";
