'use client'
import { useRef, useEffect, useState } from 'react'
import domtoimage from 'dom-to-image'
import { PodcastData } from '../types/podcast'

interface PodcastCardProps {
  podcastData: PodcastData
  userText: string
}

export default function PodcastCard({ podcastData, userText }: PodcastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setIsImageLoaded(true)
    img.src = podcastData.imageUrl
  }, [podcastData.imageUrl])

  const exportImage = async () => {
    if (cardRef.current && isImageLoaded) {
      try {
        const scale = 2;
        const width = cardRef.current.offsetWidth * scale;
        const height = cardRef.current.offsetHeight * scale;

        const dataUrl = await domtoimage.toPng(cardRef.current, {
          width: width,
          height: height,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: `${cardRef.current.offsetWidth}px`,
            height: `${cardRef.current.offsetHeight}px`,
          },
        })
        const link = document.createElement('a')
        link.download = 'podcast-card.png'
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error('Error exporting image:', error)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="relative overflow-hidden flex flex-col"
        style={{ 
          width: '400px',
          height: '533px',
          background: podcastData.backgroundColor || 'linear-gradient(145deg, rgba(0,32,0,0.9) 0%, rgba(0,64,0,0.95) 100%)'
        }}
      >
        {/* Podcast Info Section */}
        <div className="text-white p-6">
          <div className="flex items-start gap-4">
            <img
              src={podcastData.imageUrl}
              alt={podcastData.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              crossOrigin="anonymous"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-medium mb-1 leading-tight">{podcastData.title}</h2>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="flex-grow flex items-center px-8 pb-8">
          <div className="relative w-full">
            <div 
              className="absolute -top-4 left-0 text-6xl leading-none opacity-20 text-white select-none"
              style={{ userSelect: 'none' }}
            >"</div>
            <div className="text-xl leading-relaxed text-white font-medium whitespace-pre-wrap pt-8">
              {userText || "请在下方输入要显示的文字"}
            </div>
          </div>
        </div>

        {/* Channel Title Section */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="text-white/70 text-sm">@{podcastData.channel_title}</span>
        </div>
      </div>
      <button 
        onClick={exportImage} 
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isImageLoaded}
      >
        {isImageLoaded ? '导出图片' : '加载中...'}
      </button>
    </div>
  )
}

