import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Hero() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4 text-center">
      {/* 标题部分 */}
      <h1 className="mb-4 text-5xl font-bold">
        <span className="text-orange-500">一键</span>
        <span className="text-navy-900">捕获任意网页</span>
      </h1>

      {/* 副标题描述 */}
      <p className="mb-12 max-w-2xl text-gray-600">
        完整归档网页内容，包括高清截图、关键元数据和全文内容。为网页存档、内容研究和文档管理提供一站式解决方案。
      </p>

      {/* 输入框和按钮组 */}
      <div className="flex w-full max-w-2xl items-center gap-4 rounded-full bg-white p-2 shadow-lg">
        <div className="flex flex-1 items-center gap-2 pl-4">
          <span className="text-gray-400">🌐</span>
          <Input 
            type="url"
            placeholder="https://example.com"
            className="border-0 bg-transparent text-lg focus:ring-0"
          />
        </div>
        <Button className="rounded-full bg-orange-500 px-8 py-6 text-lg font-medium text-white hover:bg-orange-600">
          截取网页
        </Button>
      </div>
    </div>
  )
}