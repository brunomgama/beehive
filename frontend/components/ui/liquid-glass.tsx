"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const LiquidGlassCard = React.forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ children, title, description, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-sm rounded-3xl p-6 shadow-2xl overflow-hidden",
          "bg-black/20 backdrop-blur-xl border border-white/5",
          "text-white font-sans", className)}
        {...props}
      >
        {children || (
          <div className="text-center space-y-4">
            {title && (
              <h3 className="text-xl font-bold tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-white/70 leading-relaxed">
                {description}
              </p>
            )}
            {!title && !description && (
              <p className="text-lg font-medium">
                How can I help you today?
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";