
import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MobileForm = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement> & {
    title?: string;
    description?: string;
  }
>(({ className, title, description, children, ...props }, ref) => (
  <Card className="w-full">
    {(title || description) && (
      <CardHeader className="pb-4">
        {title && (
          <CardTitle className="text-lg sm:text-xl md:text-2xl">
            {title}
          </CardTitle>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardHeader>
    )}
    <CardContent className="pb-6">
      <form
        ref={ref}
        className={cn("space-y-4 sm:space-y-6", className)}
        {...props}
      >
        {children}
      </form>
    </CardContent>
  </Card>
))
MobileForm.displayName = "MobileForm"

const MobileFormSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
  }
>(({ className, title, description, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3 sm:space-y-4", className)}
    {...props}
  >
    {(title || description) && (
      <div className="space-y-1">
        {title && (
          <h3 className="text-base sm:text-lg font-medium text-foreground">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    )}
    <div className="space-y-3 sm:space-y-4">
      {children}
    </div>
  </div>
))
MobileFormSection.displayName = "MobileFormSection"

const MobileFormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
  }
>(({ className, label, description, error, required, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  >
    {label && (
      <label className="text-sm font-medium text-foreground flex items-center">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    {children}
    {description && (
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    )}
    {error && (
      <p className="text-xs text-destructive font-medium">
        {error}
      </p>
    )}
  </div>
))
MobileFormField.displayName = "MobileFormField"

const MobileFormActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "left" | "right" | "center" | "between";
  }
>(({ className, align = "right", children, ...props }, ref) => {
  const alignClasses = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
    between: "justify-between"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 sm:pt-6 border-t border-border",
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
})
MobileFormActions.displayName = "MobileFormActions"

export {
  MobileForm,
  MobileFormSection,
  MobileFormField,
  MobileFormActions,
}
