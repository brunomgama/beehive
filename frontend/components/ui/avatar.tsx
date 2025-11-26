"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  shape?: "square" | "rounded" | "rounded-corners" | "rounded-corners-large" | "rounded-full"
  size?: "sm" | "md" | "lg"
}

function Avatar({
  className,
  shape = "rounded",
  size = "md",
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        shape === "rounded" ? "rounded-full" : "",
        shape === "rounded-corners" ? "rounded-md" : "",
        shape === "rounded-corners-large" ? "rounded-xl" : "",
        shape === "rounded-full" ? "rounded-full" : "",
        // Size classes
        size === "sm" ? "w-8 h-8" : "",
        size === "md" ? "w-12 h-12" : "",
        size === "lg" ? "w-16 h-16" : "",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }