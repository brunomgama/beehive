// Update your floating_navbar.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Settings, CreditCard, StickyNote, BarChart3 } from "lucide-react";

interface FloatingNavProps {
  active: number;
  onActiveChange: (index: number) => void;
}

const FloatingNav = ({ active, onActiveChange }: FloatingNavProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items = [
    { id: 0, icon: <Settings size={22} />, label: "Settings" },
    { id: 1, icon: <StickyNote size={22} />, label: "Notes" },
    { id: 2, icon: <Home size={22} />, label: "Home" },
    { id: 3, icon: <CreditCard size={22} />, label: "Accounts" },
    { id: 4, icon: <BarChart3 size={22} />, label: "Info" }
  ];

  useEffect(() => {
    const updateIndicator = () => {
      if (btnRefs.current[active] && containerRef.current) {
        const btn = btnRefs.current[active];
        const container = containerRef.current;
        if (!btn) return;
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          width: btnRect.width,
          left: btnRect.left - containerRect.left,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active]);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-2">
      <div ref={containerRef}
        className="relative flex items-center justify-between bg-card backdrop-blur-xl border border-border shadow-xl rounded-full px-1 py-2">
        {items.map((item, index) => (
          <button key={item.id}
            ref={(el) => {btnRefs.current[index] = el;}} 
            onClick={() => onActiveChange(index)}
            className={`relative flex flex-col items-center justify-center 
            flex-1 px-2 py-2 text-sm font-medium transition-colors duration-200
            ${active === index ? "text-white" : "text-muted-foreground"}`}>
            <div className="z-10">{item.icon}</div>
          </button>
        ))}

        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1 bottom-1 rounded-full bg-orange"
        />
      </div>
    </div>
  );
};

export default FloatingNav;