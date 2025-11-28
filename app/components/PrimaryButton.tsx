import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react"

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  iconPosition?: "left" | "right"
  size?: "sm" | "lg"
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(function PrimaryButton(
  { children, icon, iconPosition = "left", size = "sm", className = "", disabled, type = "button", ...props },
  ref,
) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full border-none text-xs font-semibold tracking-wide text-[#031226] bg-[#3ab0ff] shadow-[0_4px_10px_rgba(72,138,236,0.45)] transition-all duration-200 select-none whitespace-nowrap"

  const sizeStyles =
    size === "lg"
      ? "px-5 py-2.5 text-sm"
      : "px-3.5 py-1.5 text-[0.77rem]"

  const enabledStyles =
    "hover:shadow-[0_8px_18px_rgba(72,138,236,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ab0ff]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020617] active:translate-y-px active:shadow-[0_4px_10px_rgba(72,138,236,0.45)]"
  const disabledStyles = "opacity-60 cursor-not-allowed shadow-none"

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles} ${disabled ? disabledStyles : enabledStyles} ${className}`.trim()}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="flex items-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      <span className="flex items-center gap-1.5 [&>svg]:h-4 [&>svg]:w-4">{children}</span>
      {icon && iconPosition === "right" && <span className="flex items-center [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
    </button>
  )
})

