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
      className={`${className} !bg-[#06a2db] !border-[#06a2db] !rounded-[9999999999999999999px] text-white hover:!bg-[#06a2db]/90 hover:!border-[#06a2db] active:!bg-[#06a2db]/80 active:!border-[#06a2db] focus:!bg-[#06a2db] focus:!border-[#06a2db]`}
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

