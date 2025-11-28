import { ReactNode } from "react"
import { Modal } from "antd"

type PrimaryModalProps = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  widthClassName?: string
  children: ReactNode
}

const widthMap: Record<string, number> = {
  "max-w-3xl": 960,
  "max-w-2xl": 720,
  "max-w-xl": 600,
}

export function PrimaryModal({
  open,
  title,
  description,
  onClose,
  widthClassName = "max-w-xl",
  children,
}: PrimaryModalProps) {
  const width = widthMap[widthClassName] ?? undefined

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={title}
      width={width}
      centered
      maskClosable={false}
      destroyOnClose
      className="primary-modal"
    >
      {description && <p className="mb-4 text-xs text-blue-200/80">{description}</p>}
      {children}
    </Modal>
  )
}

