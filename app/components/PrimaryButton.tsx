import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react"

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  iconPosition?: "left" | "right"
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(function PrimaryButton(
  { children, icon, iconPosition = "left", className = "", disabled, type = "button", ...props },
  ref,
) {
  const baseStyles =
    "inline-flex items-center justify-center gap-3 rounded-lg border-none px-6 py-2 text-[0.6rem] font-bold tracking-wide text-[#031226] bg-[#3ab0ff] shadow-[0_4px_6px_-1px_rgba(72,138,236,0.19),0_2px_4px_-1px_rgba(72,138,236,0.09)] transition-all duration-300 select-none"
  const enabledStyles =
    "hover:shadow-[0_10px_15px_-3px_rgba(72,138,236,0.31),0_4px_6px_-2px_rgba(72,138,236,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3ab0ff]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#031226] active:opacity-85"
  const disabledStyles = "opacity-60 cursor-not-allowed shadow-none"

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${disabled ? disabledStyles : enabledStyles} ${className}`.trim()}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="flex items-center [&>svg]:h-5 [&>svg]:w-5">{icon}</span>}
      <span className="flex items-center gap-2 [&>svg]:h-5 [&>svg]:w-5">{children}</span>
      {icon && iconPosition === "right" && <span className="flex items-center [&>svg]:h-5 [&>svg]:w-5">{icon}</span>}
    </button>
  )
})

