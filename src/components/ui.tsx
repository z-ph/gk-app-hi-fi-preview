import type { ReactNode } from 'react'

export function SectionTitle({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center justify-between pt-1">
      <h2 className="text-[16px] font-bold">{title}</h2>
      {right && <span className="text-[12px] text-[#969696]">{right}</span>}
    </div>
  )
}

export function StatusPill({
  label,
  tone = 'blue',
}: {
  label: string
  tone?: 'blue' | 'green' | 'orange' | 'gray' | 'red'
}) {
  const toneClass = {
    blue: 'bg-[#e8f2ff] text-[#1677ff]',
    green: 'bg-[#e8f8f2] text-[#00a870]',
    orange: 'bg-[#fff3e8] text-[#ff7a00]',
    gray: 'bg-[#f2f3f5] text-[#666]',
    red: 'bg-[#fff1f0] text-[#d93026]',
  }[tone]

  return (
    <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${toneClass}`}>
      {label}
    </span>
  )
}

export function FeatureCard({
  title,
  desc,
  right,
  children,
  onClick,
}: {
  title: string
  desc?: string
  right?: ReactNode
  children?: ReactNode
  onClick?: () => void
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="break-words text-[15px] font-bold leading-5">{title}</div>
          {desc && (
            <div className="mt-1 break-words text-[12px] leading-5 text-[#969696]">
              {desc}
            </div>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </>
  )

  if (onClick) {
    return (
      <button
        className="w-full rounded-[8px] bg-white p-4 text-left shadow-sm"
        onClick={onClick}
      >
        {content}
      </button>
    )
  }

  return <div className="rounded-[8px] bg-white p-4 shadow-sm">{content}</div>
}

export function PageTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[8px] bg-white p-4 shadow-sm">
      <div className="text-[20px] font-bold">{title}</div>
      <div className="mt-1 text-[13px] text-[#969696]">{desc}</div>
    </div>
  )
}

export function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-[#f7f8fa] p-3 text-center">
      <div className="text-[20px] font-bold">{value}</div>
      <div className="mt-1 text-[12px] text-[#969696]">{label}</div>
    </div>
  )
}

export function SummaryRow({
  label,
  value,
  strong,
  muted,
}: {
  label: string
  value: string
  strong?: boolean
  muted?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-[14px]">
      <span className="shrink-0 text-[#666]">{label}</span>
      <span
        className={`min-w-0 break-words text-right ${
          strong ? 'font-bold text-[#FF5733]' : muted ? 'text-[#969696]' : 'text-[#333]'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function StickyAction({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-[58px] left-0 right-0 z-30 mx-auto max-w-[430px] border-t border-[#f2f3f5] bg-white/95 p-3">
      {children}
    </div>
  )
}
