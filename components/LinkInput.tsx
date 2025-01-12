'use client'

interface LinkInputProps {
  onSubmit: (link: string) => void
}

export default function LinkInput({ onSubmit }: LinkInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const link = formData.get('link') as string
    if (link) onSubmit(link)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="url"
        name="link"
        placeholder="请输入播客链接..."
        className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background 
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2"
        required
      />
      <button
        type="submit"
        className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md 
          hover:bg-primary/90 inline-flex items-center justify-center text-sm font-medium 
          ring-offset-background transition-colors focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        生成
      </button>
    </form>
  )
}

