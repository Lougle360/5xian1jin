'use client'

import { useState, useEffect } from 'react'
import { Result } from '@/lib/supabase'
import { getAllResults, getResultsWithFilters, getResultsStatistics } from '@/lib/database'
import { FilterPanel } from '@/components/FilterPanel'
import { DataTable } from '@/components/DataTable'
import { StatisticsCards } from '@/components/StatisticsCards'

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

  // 加载数据
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

  // 初始加载
  useEffect(() => {
    loadData()
  }, [])

  // 应用筛选
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true)
      try {
        const filtered = await getResultsWithFilters(filters)
        setFilteredResults(filtered)

        // 更新统计信息
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
      // 计算全量统计
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">计算结果查询</h1>

        {/* 统计卡片 */}
        <StatisticsCards statistics={statistics} />

        {/* 筛选面板 */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          results={results}
          disabled={loading}
        />

        {/* 数据表格 */}
        <DataTable
          data={filteredResults}
          loading={loading}
        />
      </div>
    </div>
  )
}