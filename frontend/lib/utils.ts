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

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount)

export const formatDayLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
  