import { forwardRef, InputHTMLAttributes } from "react"

type PrimaryInputProps = InputHTMLAttributes<HTMLInputElement> & {
  size?: "sm" | "lg"
}

export const PrimaryInput = forwardRef<HTMLInputElement, PrimaryInputProps>(function PrimaryInput(
  { className = "", size = "sm", ...props },
  ref,
) {
  const sizeClasses = size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-2 text-sm"

  return (
    <input
      ref={ref}
      className={`radius-6 input ${sizeClasses} ${className}`.trim()}
      {...props}
    />
  )
})


