import Link from 'next/link'
import { Card } from '@/components/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 导航栏 */}
        <nav className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-xl">社保费用管理系统</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">数据管理</Link>
              <Link href="/results" className="text-gray-300 hover:text-white transition-colors">报表中心</Link>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl w-full">
            {/* Hero 区域 */}
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                企业社保公积金
                <span className="block text-blue-400 mt-2">智能计算平台</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                精准、高效、合规 - 为企业人力资源和财务部门提供专业的社保公积金计算解决方案
              </p>
            </div>

            {/* 功能卡片 */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card
                title="数据管理中心"
                description="批量导入城市政策标准与员工薪酬数据，智能识别并自动计算社保公积金费用"
                icon={
                  <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                }
                href="/upload"
                features={[
                  "支持Excel批量导入",
                  "自动数据校验",
                  "多城市政策适配"
                ]}
              />

              <Card
                title="统计分析报表"
                description="多维度查询计算结果，实时统计企业人力成本，支持数据导出与报告生成"
                icon={
                  <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                }
                href="/results"
                features={[
                  "实时成本统计",
                  "多维度筛选",
                  "数据可视化展示"
                ]}
              />
            </div>

            {/* 特性展示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">精准合规</h3>
                <p className="text-gray-400 text-sm">严格遵循各地最新社保政策，确保计算结果准确无误</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">高效便捷</h3>
                <p className="text-gray-400 text-sm">批量处理数据，一键生成报表，大幅提升工作效率</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">安全可靠</h3>
                <p className="text-gray-400 text-sm">企业级数据安全保障，确保薪酬信息安全不泄露</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <footer className="py-6 text-center text-gray-400 text-sm">
          <p>© 2024 社保费用管理系统. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}