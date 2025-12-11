'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Result } from '@/lib/supabase'
import { getAllResults, getResultsWithFilters, getResultsStatistics } from '@/lib/database'
import { FilterPanel } from '@/components/FilterPanel'
import { DataTable } from '@/components/DataTable'
import { StatisticsCards } from '@/components/StatisticsCards'

// 动态导出以防止预渲染
export const dynamic = 'force-dynamic'

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [filteredResults, setFilteredResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: '',
    year: '',
    employeeName: ''
  })
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalCompanyFee: 0,
    avgCompanyFee: 0
  })

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getAllResults()
      setResults(data)
      setFilteredResults(data)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true)
      try {
        const filtered = await getResultsWithFilters(filters)
        setFilteredResults(filtered)

        const stats = await getResultsStatistics(filters)
        setStatistics(stats)
      } catch (error) {
        console.error('筛选失败:', error)
      } finally {
        setLoading(false)
      }
    }

    if (filters.city || filters.year || filters.employeeName) {
      applyFilters()
    } else {
      setFilteredResults(results)
      const totalEmployees = new Set(results.map(r => r.employee_name)).size
      const totalCompanyFee = results.reduce((sum, r) => sum + r.company_fee, 0)
      setStatistics({
        totalEmployees,
        totalCompanyFee: Math.round(totalCompanyFee * 100) / 100,
        avgCompanyFee: results.length > 0
          ? Math.round((totalCompanyFee / results.length) * 100) / 100
          : 0
      })
    }
  }, [filters, results])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>返回首页</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">计算结果查询</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/upload"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                数据管理
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <StatisticsCards statistics={statistics} />

          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            results={results}
            disabled={loading}
          />

          <DataTable
            data={filteredResults}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}