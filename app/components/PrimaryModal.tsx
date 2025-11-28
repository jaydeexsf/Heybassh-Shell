import { ReactNode, MouseEvent } from "react"

type PrimaryModalProps = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  widthClassName?: string
  children: ReactNode
}

export function PrimaryModal({
  open,
  title,
  description,
  onClose,
  widthClassName = "max-w-xl",
  children,
}: PrimaryModalProps) {
  if (!open) return null

  const stop = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-10"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full ${widthClassName} bg-[#0b1020] text-blue-50 shadow-2xl border border-white/8`}
        onClick={stop}
      >
        <div className="flex items-start justify-between border-b border-white/8 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {description && <p className="mt-1 text-xs text-blue-200/80">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center text-blue-200/80 hover:text-white hover:bg-white/5"
            aria-label="Close modal"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}


