"use client"

import { useState } from "react"
import { MeshGradient, DotOrbit } from "@paper-design/shaders-react"
import { NeuralNetworkBackground } from "./cpp-shader"

export function MobileBackground() {
  const [speed] = useState(0.1)

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      
      {/* OPTION 1 */}
      {/* <NeuralNetworkBackground /> */}

      {/* OPTION 2 */}
      {/* // Black and White */}
      {/* <MeshGradient className="w-full h-full absolute inset-0" colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
        speed={speed} style={{ backgroundColor: "#000000" }}/> */}

      {/* // Blue Ocean Theme */}
      {/* <MeshGradient className="w-full h-full absolute inset-0" colors={["#0f172a", "#1e293b", "#3b82f6", "#60a5fa"]}
        speed={speed} style={{ backgroundColor: "#0f172a" }}/> */}

      {/* // Purple Galaxy Theme */}
      {/* <MeshGradient className="w-full h-full absolute inset-0" colors={["#1a0933", "#4c1d95", "#7c3aed", "#a855f7"]}
        speed={speed} style={{ backgroundColor: "#1a0933" }}/> */}

      {/* // Green Forest Theme */}
      {/* <MeshGradient className="w-full h-full absolute inset-0" colors={["#064e3b", "#065f46", "#10b981", "#34d399"]}
        speed={speed} style={{ backgroundColor: "#064e3b" }}/> */}

      {/* // Orange Sunset Theme */}
      {/* <MeshGradient className="w-full h-full absolute inset-0" colors={["#431407", "#9a3412", "#ea580c", "#fb923c"]}
        speed={speed} style={{ backgroundColor: "#431407" }}/> */}

      {/* // Red Fire Theme
      <MeshGradient className="w-full h-full absolute inset-0" colors={["#450a0a", "#7f1d1d", "#dc2626", "#f87171"]}
        speed={speed} style={{ backgroundColor: "#450a0a" }}/> */}

      {/* // Teal Cyber Theme
      <MeshGradient className="w-full h-full absolute inset-0" colors={["#042f2e", "#134e4a", "#0d9488", "#2dd4bf"]}
        speed={speed} style={{ backgroundColor: "#042f2e" }}/> */}

      {/* // Pink Neon Theme
      <MeshGradient className="w-full h-full absolute inset-0" colors={["#500724", "#831843", "#db2777", "#f472b6"]}
        speed={speed} style={{ backgroundColor: "#500724" }}/> */}

      {/* // Indigo Night Theme
      <MeshGradient className="w-full h-full absolute inset-0" colors={["#1e1b4b", "#312e81", "#6366f1", "#818cf8"]}
        speed={speed} style={{ backgroundColor: "#1e1b4b" }}/> */}

      {/* // Black with Bright Neon Purple
      <MeshGradient className="w-full h-full absolute inset-0" colors={["#000000", "#0f0f0f", "#7c3aed", "#c084fc"]}
        speed={speed} style={{ backgroundColor: "#000000" }}/> */}

      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-gray-800/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: `${6 / speed}s` }}/>
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/2 rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: `${4 / speed}s`, animationDelay: "2s" }}/>
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-gray-900/3 rounded-full blur-xl animate-pulse"
          style={{ animationDuration: `${8 / speed}s`, animationDelay: "1s" }}/>
      </div>

      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}