'use client'

import { useState } from 'react'
import LinkInput from './LinkInput'
import PodcastCard from './PodcastCard'
import TextInput from './TextInput'
import { PodcastData } from '../types/podcast'

export default function PodcastImageGenerator() {
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null)
  const [userText, setUserText] = useState('')

  const handleLinkSubmit = async (link: string) => {
    try {
      const response = await fetch('/api/fetch_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link }),
      })
      const data = await response.json()
      setPodcastData(data)
    } catch (error) {
      console.error('Error fetching podcast data:', error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">播客图片生成器</h1>
        <p className="text-muted-foreground">
          输入播客链接，生成精美的分享图片
        </p>
      </div>

      {/* Input Section */}
      <div className="p-6 border rounded-lg bg-card shadow-sm space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">播客链接</h2>
          <p className="text-sm text-muted-foreground">
            支持小宇宙播客单集链接
          </p>
        </div>
        <LinkInput onSubmit={handleLinkSubmit} />
      </div>

      {/* Preview Section */}
      {podcastData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">预览与编辑</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-[400px,1fr] items-start">
            <PodcastCard podcastData={podcastData} userText={userText} />
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="quote-text" className="text-sm font-medium">
                  引用文字
                </label>
                <TextInput
                  value={userText}
                  onChange={setUserText}
                  placeholder="在此输入要显示的文字..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

