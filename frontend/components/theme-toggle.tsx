"use client"

import { Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-12 justify-center bg-primary hover:bg-primary-hover text-primary-foreground">
          <Palette className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Palette className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-primary hover:bg-primary-hover text-primary-foreground" : ""}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-primary hover:bg-primary-hover text-primary-foreground" : ""}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("red")}
          className={theme === "red" ? "bg-primary hover:bg-primary-hover text-primary-foreground" : ""}>
          Red
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("purple")}
          className={theme === "purple" ? "bg-primary hover:bg-primary-hover text-primary-foreground" : ""}>
          Purple
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("cyan")}
          className={theme === "cyan" ? "bg-primary hover:bg-primary-hover text-primary-foreground" : ""}>
          Cyan
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("emerald")}
          className={theme === "emerald" ? "bg-primary hover:bg-primary-hover text-primary-foreground" : ""}>
          Esmerald
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}