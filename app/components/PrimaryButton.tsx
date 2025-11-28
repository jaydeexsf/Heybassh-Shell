import { ReactNode, forwardRef } from "react"
import { Button, ButtonProps } from "antd"

type PrimaryButtonProps = Omit<ButtonProps, "type"> & {
  icon?: ReactNode
  iconPosition?: "left" | "right"
  type?: "button" | "submit" | "reset"
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(function PrimaryButton(
  { children, icon, iconPosition = "left", className = "", disabled, type = "button", ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      type="primary"
      htmlType={type}
      disabled={disabled}
      className={className}
      icon={iconPosition === "left" ? icon : undefined}
      {...props}
    >
      {iconPosition === "right" ? (
        <span className="inline-flex items-center gap-2">
          {children}
          {icon}
        </span>
      ) : (
        children
      )}
    </Button>
  )
})

