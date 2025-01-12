import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { createCanvas, loadImage } from 'canvas'
import Color from 'color'

// 将 RGB 转换为十六进制颜色
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// 检查颜色是否接近白色
function isNearWhite(r: number, g: number, b: number): boolean {
  const threshold = 230 // 阈值，可以调整
  return r > threshold && g > threshold && b > threshold
}

// 调整颜色亮度和饱和度，使其更有艺术感
function adjustColor(r: number, g: number, b: number): { r: number, g: number, b: number } {
  // 计算亮度
  const brightness = (r + g + b) / 3
  
  // 计算饱和度
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const saturation = (max - min) / max
  
  // 根据亮度和饱和度调整颜色
  let factor = 1
  
  // 如果颜色太亮，降低亮度
  if (brightness > 200) {
    factor = 0.7
  } 
  // 如果颜色太暗，提高亮度
  else if (brightness < 50) {
    factor = 1.3
  }
  
  // 如果饱和度太低，增加饱和度
  if (saturation < 0.2) {
    const avg = (r + g + b) / 3
    r = r + (r - avg) * 0.5
    g = g + (g - avg) * 0.5
    b = b + (b - avg) * 0.5
  }
  
  return {
    r: Math.min(255, Math.round(r * factor)),
    g: Math.min(255, Math.round(g * factor)),
    b: Math.min(255, Math.round(b * factor))
  }
}

// 生成高级渐变背景
async function generateGradientFromImage(imageUrl: string): Promise<string> {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    })
    
    const image = await loadImage(Buffer.from(response.data))
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)
    
    // 采样更多点以获取丰富的颜色
    const samplePoints = [
      { x: Math.floor(image.width / 2), y: Math.floor(image.height / 2) }, // 中心
      { x: Math.floor(image.width / 3), y: Math.floor(image.height / 3) }, // 左上区域
      { x: Math.floor(image.width * 2/3), y: Math.floor(image.height * 2/3) }, // 右下区域
      { x: Math.floor(image.width * 2/3), y: Math.floor(image.height / 3) }, // 右上区域
    ]
    
    // 获取并处理颜色
    const colors = samplePoints.map(point => {
      const data = ctx.getImageData(point.x, point.y, 1, 1).data
      const adjustedColor = adjustColor(data[0], data[1], data[2])
      return rgbToHex(adjustedColor.r, adjustedColor.g, adjustedColor.b)
    }).filter((color, index, self) => self.indexOf(color) === index)
    
    // 生成自然柔和的渐变背景
    if (colors.length === 1) {
      const color = Color(colors[0])
      return `
        linear-gradient(165deg, 
          ${color.alpha(0.97).toString()} 0%,
          ${color.darken(0.1).alpha(0.95).toString()} 45%,
          ${color.darken(0.2).alpha(0.92).toString()} 100%
        ),
        linear-gradient(45deg,
          ${color.lighten(0.1).alpha(0.88).toString()} 0%,
          ${color.alpha(0.85).toString()} 100%
        )
      `
    } else if (colors.length >= 2) {
      const color1 = Color(colors[0])
      const color2 = Color(colors[1])
      const mixedColor = color1.mix(color2, 0.5)
      
      return `
        linear-gradient(165deg,
          ${color1.alpha(0.97).toString()} 0%,
          ${mixedColor.alpha(0.95).toString()} 45%,
          ${color2.alpha(0.92).toString()} 100%
        ),
        linear-gradient(45deg,
          ${color1.lighten(0.1).alpha(0.85).toString()} 0%,
          ${color2.alpha(0.82).toString()} 100%
        )
      `
    }
    
    // 默认渐变
    return `
      linear-gradient(165deg,
        hsla(198, 92%, 44%, 0.97) 0%,
        hsla(198, 92%, 39%, 0.95) 45%,
        hsla(198, 92%, 34%, 0.92) 100%
      ),
      linear-gradient(45deg,
        hsla(198, 92%, 49%, 0.85) 0%,
        hsla(198, 92%, 34%, 0.82) 100%
      )
    `
  } catch (error) {
    console.error('Error generating gradient:', error)
    return `
      linear-gradient(165deg,
        hsla(198, 92%, 44%, 0.97) 0%,
        hsla(198, 92%, 39%, 0.95) 45%,
        hsla(198, 92%, 34%, 0.92) 100%
      ),
      linear-gradient(45deg,
        hsla(198, 92%, 49%, 0.85) 0%,
        hsla(198, 92%, 34%, 0.82) 100%
      )
    `
  }
}

export async function POST(req: Request) {
  try {
    const { link } = await req.json()

    if (!link) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const response = await axios.get(link, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      },
    })
    const html = response.data
    const $ = cheerio.load(html)

    // 获取 og:image 和 og:title 标签内容
    const title = $('meta[property="og:title"]').attr('content')
    const imageUrl = $('meta[property="og:image"]').attr('content')
    const description = $('meta[property="og:description"]').attr('content') || ''
    
    // 从 description 中提取《》中的内容作为 channel_title
    let channel_title = ''
    const matches = description.match(/《([^》]+)》/)
    if (matches && matches[1]) {
      channel_title = matches[1]
    }
    
    console.log('Description:', description)
    console.log('Extracted channel title:', channel_title)

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Unable to extract data. Please check the URL.' },
        { status: 404 }
      )
    }

    // 生成渐变背景
    const backgroundColor = await generateGradientFromImage(imageUrl)
    console.log('Generated gradient:', backgroundColor)

    // 返回抓取的数据
    return NextResponse.json({
      imageUrl,
      title,
      description,
      backgroundColor,
      channel_title,
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch the URL.' },
      { status: 500 }
    )
  }
}

