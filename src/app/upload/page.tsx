'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UploadButton } from '@/components/UploadButton'
import { CitySelector } from '@/components/CitySelector'
import { parseCitiesExcel, parseSalariesExcel } from '@/lib/excelParser'
import { clearTable, insertCities, insertSalaries, getAllCities, getAllSalaries, insertCalculationResults } from '@/lib/database'
import { calculateSocialInsurance } from '@/lib/calculations'

export default function UploadPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [cities, setCities] = useState<any[]>([])
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleCitiesUpload = async (file: File) => {
    setLoading(true)
    try {
      const { cities: parsedCities, errors } = await parseCitiesExcel(file)

      if (errors.length > 0) {
        showMessage('error', `文件解析错误：\n${errors.join('\n')}`)
        return
      }

      await clearTable('cities')
      await insertCities(parsedCities)

      const updatedCities = await getAllCities()
      setCities(updatedCities)

      showMessage('success', `成功上传 ${parsedCities.length} 条城市政策数据`)
    } catch (error) {
      showMessage('error', `上传失败：${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSalariesUpload = async (file: File) => {
    setLoading(true)
    try {
      const { salaries: parsedSalaries, errors } = await parseSalariesExcel(file)

      if (errors.length > 0) {
        showMessage('error', `文件解析错误：\n${errors.join('\n')}`)
        return
      }

      await clearTable('salaries')
      await insertSalaries(parsedSalaries)

      showMessage('success', `成功上传 ${parsedSalaries.length} 条员工薪酬数据`)
    } catch (error) {
      showMessage('error', `上传失败：${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCalculate = async () => {
    if (!selectedCity || !selectedYear) {
      showMessage('error', '请选择城市和年份')
      return
    }

    setLoading(true)
    try {
      const salaries = await getAllSalaries()
      const citiesData = await getAllCities()

      const results = calculateSocialInsurance({
        salaries,
        cities: citiesData,
        selectedCity,
        selectedYear
      })

      await insertCalculationResults(results)

      showMessage('success', `成功计算 ${results.length} 名员工的社保公积金费用`)
    } catch (error) {
      showMessage('error', `计算失败：${error}`)
    } finally {
      setLoading(false)
    }
  }

  // 加载时获取城市数据
  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await getAllCities()
        setCities(citiesData)
      } catch (error) {
        console.error('加载城市数据失败:', error)
      }
    }
    loadCities()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10">
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
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">首页</Link>
              <Link href="/upload" className="text-white font-medium">数据管理</Link>
              <Link href="/results" className="text-gray-300 hover:text-white transition-colors">报表中心</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">数据管理中心</h1>
            <p className="text-xl text-gray-300">批量导入数据，智能计算社保公积金费用</p>
          </div>

          {/* 消息提示 */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-500 bg-opacity-20 text-green-300 border border-green-500 border-opacity-30' :
              message.type === 'error' ? 'bg-red-500 bg-opacity-20 text-red-300 border border-red-500 border-opacity-30' :
              'bg-blue-500 bg-opacity-20 text-blue-300 border border-blue-500 border-opacity-30'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' && (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message.type === 'error' && (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message.text}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 左侧：上传区域 */}
            <div className="space-y-6">
              {/* 城市政策上传 */}
              <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl border border-white border-opacity-10 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">城市政策标准</h2>
                    <p className="text-gray-400 text-sm mt-1">导入各地社保基数与费率标准</p>
                  </div>
                </div>
                <UploadButton
                  onFileSelect={handleCitiesUpload}
                  accept=".xlsx"
                  disabled={loading}
                  label="选择城市政策文件 (cities.xlsx)"
                />
              </div>

              {/* 员工薪酬上传 */}
              <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl border border-white border-opacity-10 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">员工薪酬数据</h2>
                    <p className="text-gray-400 text-sm mt-1">导入员工工号、姓名与工资记录</p>
                  </div>
                </div>
                <UploadButton
                  onFileSelect={handleSalariesUpload}
                  accept=".xlsx"
                  disabled={loading}
                  label="选择薪酬数据文件 (salaries.xlsx)"
                />
              </div>
            </div>

            {/* 右侧：计算区域 */}
            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl border border-white border-opacity-10 p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">费用计算配置</h2>
                  <p className="text-gray-400 text-sm mt-1">选择计算参数并执行计算</p>
                </div>
              </div>

              <div className="space-y-6">
                <CitySelector
                  cities={cities}
                  selectedCity={selectedCity}
                  selectedYear={selectedYear}
                  onCityChange={setSelectedCity}
                  onYearChange={setSelectedYear}
                  disabled={loading}
                />

                <button
                  onClick={handleCalculate}
                  disabled={loading || !selectedCity || !selectedYear}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      计算中，请稍候...
                    </div>
                  ) : (
                    '开始计算社保费用'
                  )}
                </button>

                {/* 计算说明 */}
                <div className="bg-white bg-opacity-5 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">计算规则说明</h3>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• 自动计算每位员工的年度月平均工资</li>
                    <li>• 根据当地政策确定社保缴费基数</li>
                    <li>• 应用对应城市的综合缴纳比例</li>
                    <li>• 生成详细的费用计算结果</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 文件格式说明 - 折叠式 */}
          <div className="mt-8 bg-white bg-opacity-5 backdrop-blur-sm rounded-2xl border border-white border-opacity-10 p-6">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-lg font-semibold text-white">📋 文件格式规范</span>
                <svg className="w-5 h-5 text-gray-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <div className="mt-4 grid md:grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-5 rounded-xl p-4">
                  <h4 className="font-medium text-blue-400 mb-3">城市政策文件 (cities.xlsx)</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white border-opacity-10">
                        <th className="text-left text-gray-400 pb-2">字段名</th>
                        <th className="text-left text-gray-400 pb-2">说明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-white border-opacity-5">
                        <td className="py-2 font-mono text-xs">city_name</td>
                        <td className="py-2">城市名称</td>
                      </tr>
                      <tr className="border-b border-white border-opacity-5">
                        <td className="py-2 font-mono text-xs">year</td>
                        <td className="py-2">年份</td>
                      </tr>
                      <tr className="border-b border-white border-opacity-5">
                        <td className="py-2 font-mono text-xs">base_min</td>
                        <td className="py-2">社保基数下限</td>
                      </tr>
                      <tr className="border-b border-white border-opacity-5">
                        <td className="py-2 font-mono text-xs">base_max</td>
                        <td className="py-2">社保基数上限</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-xs">rate</td>
                        <td className="py-2">综合缴纳比例 (0-1)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-white bg-opacity-5 rounded-xl p-4">
                  <h4 className="font-medium text-green-400 mb-3">员工薪酬文件 (salaries.xlsx)</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white border-opacity-10">
                        <th className="text-left text-gray-400 pb-2">字段名</th>
                        <th className="text-left text-gray-400 pb-2">说明</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-white border-opacity-5">
                        <td className="py-2 font-mono text-xs">employee_id</td>
                        <td className="py-2">员工工号</td>
                      </tr>
                      <tr className="border-b border-white border-opacity-5">
                        <td className="py-2 font-mono text-xs">employee_name</td>
                        <td className="py-2">员工姓名</td>
                      </tr>
                      <tr className="border-b border-white border-opacity-5">
                        <td className="py-2 font-mono text-xs">month</td>
                        <td className="py-2">年月 (YYYYMM)</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-mono text-xs">salary_amount</td>
                        <td className="py-2">工资金额</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}