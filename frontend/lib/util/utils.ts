import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatFullDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export const formatDayLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
  
  export const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    }).format(balance)
}

export const getCardGradient = (type: string) => {
  const gradients = {
      CURRENT: 'from-red-400 via-orange-400 to-pink-400',
      SAVINGS: 'from-emerald-400 via-teal-400 to-cyan-400',
      INVESTMENTS: 'from-blue-400 via-indigo-400 to-purple-400',
      CLOSED: 'from-gray-400 to-slate-500',
  }
  return gradients[type as keyof typeof gradients] || 'from-purple-500 via-pink-500 to-rose-500'
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}