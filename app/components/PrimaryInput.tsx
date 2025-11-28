import { forwardRef } from "react"
import { Input, InputProps } from "antd"
import type { InputRef } from "antd"

type PrimaryInputProps = Omit<InputProps, "size"> & {
  size?: "sm" | "lg" | "md"
}

export const PrimaryInput = forwardRef<InputRef, PrimaryInputProps>(function PrimaryInput(
  { className = "", size = "sm", ...props },
  ref,
) {
  const resolvedSize = size === "lg" ? "large" : size === "sm" ? "small" : "middle"
  const combinedClassName = ["w-full", className].filter(Boolean).join(" ")

  return (
    <Input
      ref={ref}
      size={resolvedSize}
      className={combinedClassName}
      {...props}
    />
  )
})


