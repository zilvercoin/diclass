"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  React.ElementRef<typeof HTMLDivElement>,
  React.ComponentPropsWithoutRef<typeof HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props}>
    {children}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  React.ElementRef<typeof HTMLDivElement>,
  React.ComponentPropsWithoutRef<typeof HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  React.ElementRef<typeof HTMLParagraphElement>,
  React.ComponentPropsWithoutRef<typeof HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </p>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  React.ElementRef<typeof HTMLParagraphElement>,
  React.ComponentPropsWithoutRef<typeof HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  React.ElementRef<typeof HTMLDivElement>,
  React.ComponentPropsWithoutRef<typeof HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div className={cn("p-6 pt-0", className)} ref={ref} {...props}>
    {children}
  </div>
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  React.ElementRef<typeof HTMLDivElement>,
  React.ComponentPropsWithoutRef<typeof HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div className={cn("flex items-center p-6 pt-0", className)} ref={ref} {...props}>
    {children}
  </div>
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
