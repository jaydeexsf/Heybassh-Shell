import { ReactNode, forwardRef } from "react"
import { Button, ButtonProps } from "antd"

type PrimarySize = "sm" | "md" | "lg" | "small" | "middle" | "large"

type PrimaryButtonProps = Omit<ButtonProps, "type" | "size"> & {
  icon?: ReactNode
  iconPosition?: "left" | "right"
  type?: "button" | "submit" | "reset"
  size?: PrimarySize
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(function PrimaryButton(
  { children, icon, iconPosition = "left", className = "", disabled, type = "button", size = "md", ...props },
  ref,
) {
  const mappedSize: ButtonProps["size"] =
    size === "lg" || size === "large"
      ? "large"
      : size === "sm" || size === "small"
      ? "small"
      : "middle"

  return (
    <Button
      ref={ref}
      type="primary"
      htmlType={type}
      disabled={disabled}
      size={mappedSize}
      className={`${className} !bg-[#06a2db] !hover:bg-[#06a2db]/80 active:!bg-transparent`}
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

