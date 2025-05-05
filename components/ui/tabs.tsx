"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground data-[orientation=horizontal]:w-[300px] data-[orientation=vertical]:w-[400px]",
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all focus:relative focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

import * as CardPrimitives from "@/components/ui/card"

const Card = React.forwardRef<
  React.ElementRef<typeof CardPrimitives.Card>,
  React.ComponentPropsWithoutRef<typeof CardPrimitives.Card>
>(({ className, ...props }, ref) => (
  <CardPrimitives.Card
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  React.ElementRef<typeof CardPrimitives.CardHeader>,
  React.ComponentPropsWithoutRef<typeof CardPrimitives.CardHeader>
>(({ className, ...props }, ref) => (
  <CardPrimitives.CardHeader ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  React.ElementRef<typeof CardPrimitives.CardTitle>,
  React.ComponentPropsWithoutRef<typeof CardPrimitives.CardTitle>
>(({ className, ...props }, ref) => (
  <CardPrimitives.CardTitle
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  React.ElementRef<typeof CardPrimitives.CardDescription>,
  React.ComponentPropsWithoutRef<typeof CardPrimitives.CardDescription>
>(({ className, ...props }, ref) => (
  <CardPrimitives.CardDescription ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  React.ElementRef<typeof CardPrimitives.CardContent>,
  React.ComponentPropsWithoutRef<typeof CardPrimitives.CardContent>
>(({ className, ...props }, ref) => (
  <CardPrimitives.CardContent className={cn("p-6 pt-0", className)} ref={ref} {...props} />
))
CardContent.displayName = "CardContent"

export { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardDescription, CardContent }
