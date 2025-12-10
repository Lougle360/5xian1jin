import Link from 'next/link'

interface CardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  features?: string[]
}

export function Card({ title, description, icon, href, features = [] }: CardProps) {
  return (
    <Link href={href} className="group block">
      <div className="relative bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl border border-white border-opacity-10 hover:bg-opacity-10 transition-all duration-300 p-8 h-full">
        {/* 发光效果 */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            {description}
          </p>

          {/* 功能特性列表 */}
          {features.length > 0 && (
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* 箭头图标 */}
          <div className="mt-6 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="mr-2">进入</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}