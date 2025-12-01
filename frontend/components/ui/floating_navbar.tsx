"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Settings, Wallet, Calendar, BarChart3 } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { getButtonStyle } from "@/lib/themes";

interface FloatingNavProps {
  active: number;
  onActiveChange: (index: number) => void;
}

const FloatingNav = ({ active, onActiveChange }: FloatingNavProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { theme } = useTheme();

  const items = [
    { id: 0, icon: <Settings size={22} />, label: "Settings" },
    { id: 1, icon: <Calendar size={22} />, label: "Schedule" },
    { id: 2, icon: <Home size={22} />, label: "Home" },
    { id: 3, icon: <Wallet size={22} />, label: "Finance" },
    { id: 4, icon: <BarChart3 size={22} />, label: "Analytics" }
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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div ref={containerRef}
        className="relative flex items-center justify-between backdrop-blur-xl rounded-full px-1 py-2">
        {items.map((item, index) => (
          <button  key={item.id} ref={(el) => {btnRefs.current[index] = el;}}  onClick={() => onActiveChange(index)}
            className={`relative flex flex-col items-center justify-center flex-1 px-2 py-2 text-sm 
                font-medium transition-colors duration-200 z-20
            ${active === index ? "text-white" : "text-gray-600 dark:text-gray-400"}`}>
            <div className="z-10">{item.icon}</div>
          </button>
        ))}

        <motion.div animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`absolute top-1 bottom-1 rounded-full ${getButtonStyle(theme)} z-10`}
        />
      </div>
    </div>
  );
};

export default FloatingNav;