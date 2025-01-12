'use client'
interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm 
        ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    />
  )
}

