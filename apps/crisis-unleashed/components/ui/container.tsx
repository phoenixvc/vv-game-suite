import { cn } from "@/lib/utils"

/**
 * Props for the Container component that provides consistent styling
 * with minimum screen height and background colors for light/dark modes.
 */
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode
 }
export function Container({ children, className, ...props }: ContainerProps) {
  return (
<div 
  className={cn("min-h-screen bg-gray-100 dark:bg-gray-900", className)}
 role="main"
  {...props}
>
      {children}
    </div>
  )
}