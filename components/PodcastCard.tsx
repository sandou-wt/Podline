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
        {/* Podcast Info Section - 调整标题布局和样式 */}
        <div className="text-white px-7 pt-7 pb-4 flex-none">
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div 
                className="absolute inset-0 blur-md opacity-60"
                style={{
                  background: `radial-gradient(
                    circle at center,
                    rgba(255,255,255,0.2) 0%,
                    transparent 70%
                  )`
                }}
              />
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  boxShadow: `
                    0 0 20px rgba(0,0,0,0.2),
                    0 4px 8px rgba(0,0,0,0.1),
                    inset 0 0 0 1px rgba(255,255,255,0.1)
                  `
                }}
              />
              <img
                src={podcastData.imageUrl}
                alt={podcastData.title}
                className="relative w-16 h-16 rounded-lg object-cover z-10"
                style={{
                  boxShadow: `
                    0 2px 4px rgba(0,0,0,0.1),
                    0 4px 8px rgba(0,0,0,0.1),
                    0 8px 16px rgba(0,0,0,0.1)
                  `
                }}
                crossOrigin="anonymous"
              />
            </div>
            
            {/* 标题部分优化 */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <h2 className="text-lg font-normal leading-snug tracking-wide opacity-90 line-clamp-2">
                {podcastData.title}
              </h2>
              <span className="text-[13px] font-light tracking-wider opacity-75 transform -translate-y-0.5">
                @{podcastData.channel_title}
              </span>
            </div>
          </div>
        </div>

        {/* Quote Section - 优化布局和间距 */}
        <div className="flex-grow flex items-center justify-center px-10">
          <div 
            className="relative w-full max-h-[320px] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.3) transparent'
            }}
          >
            {/* 引号背景 */}
            <div 
              className="absolute -top-4 left-0 text-6xl leading-none opacity-20 text-white select-none pointer-events-none"
              style={{ userSelect: 'none' }}
            >"</div>
            
            {/* 文本内容 - 优化字体样式 */}
            <div 
              className="relative text-xl text-white whitespace-pre-wrap py-6"
              style={{
                maxWidth: '100%',
                wordBreak: 'break-word',
                fontFamily: '-apple-system-ui-serif, "Songti SC", STSong, "Noto Serif CJK SC", serif',
                lineHeight: '1.85',
                letterSpacing: '0.02em',
                fontWeight: '500',
                fontOpticalSizing: 'auto',
                textShadow: '0 2px 4px rgba(0,0,0,0.12)',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                fontFeatureSettings: '"palt"',
                textRendering: 'optimizeLegibility',
              }}
            >
              {userText || "请在下方输入要显示的文字"}
            </div>
          </div>
        </div>

        {/* Footer Section - 固定位置和高度 */}
        <div className="flex-none h-16 flex items-center justify-center">
          <span className="text-white/70 text-sm font-medium tracking-wide">
            Made By Podline
          </span>
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

