import * as SwitchPrimitive from '@radix-ui/react-switch'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  labelHe: string
  id?: string
}

export function Switch({ checked, onCheckedChange, labelHe, id }: SwitchProps) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 py-3 cursor-pointer">
      <span className="text-base">{labelHe}</span>
      <SwitchPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="relative h-8 w-14 shrink-0 rounded-full bg-surface-2 border border-border data-[state=checked]:bg-brand outline-none"
      >
        {/* App is RTL-only: "on" visually moves the thumb toward the left (inline-end). */}
        <SwitchPrimitive.Thumb className="block h-6 w-6 translate-x-7 rounded-full bg-white transition-transform data-[state=checked]:translate-x-1" />
      </SwitchPrimitive.Root>
    </label>
  )
}
