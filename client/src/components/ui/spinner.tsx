import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Loading spinner component with configurable size
 */
export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent",
        sizeClasses[size],
        "border-duo-green-500",
        className
      )}
      aria-label="Loading"
    />
  );
}