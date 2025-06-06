
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

const ResponsiveTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    showMobileCards?: boolean;
  }
>(({ className, showMobileCards = true, ...props }, ref) => (
  <div className="relative w-full">
    {/* Mobile Card View */}
    {showMobileCards && (
      <div className="block md:hidden">
        {props.children}
      </div>
    )}
    
    {/* Desktop Table View */}
    <div className={`${showMobileCards ? 'hidden md:block' : 'block'} overflow-auto`}>
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  </div>
))
ResponsiveTable.displayName = "ResponsiveTable"

const ResponsiveTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b bg-muted/50", className)} {...props} />
))
ResponsiveTableHeader.displayName = "ResponsiveTableHeader"

const ResponsiveTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
ResponsiveTableBody.displayName = "ResponsiveTableBody"

const ResponsiveTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
ResponsiveTableRow.displayName = "ResponsiveTableRow"

const ResponsiveTableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 sm:px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-xs sm:text-sm",
      className
    )}
    {...props}
  />
))
ResponsiveTableHead.displayName = "ResponsiveTableHead"

const ResponsiveTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-2 sm:p-4 align-middle [&:has([role=checkbox])]:pr-0 text-xs sm:text-sm", className)}
    {...props}
  />
))
ResponsiveTableCell.displayName = "ResponsiveTableCell"

const ResponsiveTableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
ResponsiveTableCaption.displayName = "ResponsiveTableCaption"

// Mobile Card Components for displaying table data as cards on mobile
const MobileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn("mb-3 p-0", className)}
    {...props}
  />
))
MobileCard.displayName = "MobileCard"

const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("p-4 space-y-2", className)}
    {...props}
  />
))
MobileCardContent.displayName = "MobileCardContent"

const MobileCardField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label: string;
    value: React.ReactNode;
  }
>(({ className, label, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1", className)}
    {...props}
  >
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm text-foreground">
      {value}
    </span>
  </div>
))
MobileCardField.displayName = "MobileCardField"

const MobileCardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end space-x-2 pt-2 border-t border-border", className)}
    {...props}
  />
))
MobileCardActions.displayName = "MobileCardActions"

export {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableHead,
  ResponsiveTableCell,
  ResponsiveTableCaption,
  MobileCard,
  MobileCardContent,
  MobileCardField,
  MobileCardActions,
}
