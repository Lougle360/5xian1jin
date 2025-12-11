import { City, Salary, Result, getSupabaseClient } from './supabase'
import { CalculationResult } from './calculations'

// 清空表数据
export async function clearTable(tableName: 'cities' | 'salaries' | 'results') {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from(tableName)
    .delete()
    .neq('id', 0) // 删除所有记录

  if (error) {
    throw new Error(`清空表 ${tableName} 失败: ${error.message}`)
  }
}

// 清空所有数据
export async function clearAllData() {
  const supabase = getSupabaseClient()
  const tables = ['results', 'salaries', 'cities']

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .neq('id', 0)

    if (error) {
      throw new Error(`清空表 ${table} 失败: ${error.message}`)
    }
  }
}

// 批量插入城市数据
export async function insertCities(cities: Omit<City, 'id'>[]) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('cities')
    .insert(cities)

  if (error) {
    throw new Error(`插入城市数据失败: ${error.message}`)
  }
}

// 批量插入工资数据
export async function insertSalaries(salaries: Omit<Salary, 'id'>[]) {
  const supabase = getSupabaseClient()
  const { error } = await supabase
    .from('salaries')
    .insert(salaries)

  if (error) {
    throw new Error(`插入工资数据失败: ${error.message}`)
  }
}

// 获取所有城市数据
export async function getAllCities(): Promise<City[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('year', { ascending: false })

  if (error) {
    throw new Error(`获取城市数据失败: ${error.message}`)
  }

  return data || []
}

// 获取所有工资数据
export async function getAllSalaries(): Promise<Salary[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .order('month', { ascending: true })

  if (error) {
    throw new Error(`获取工资数据失败: ${error.message}`)
  }

  return data || []
}

// 插入计算结果
export async function insertCalculationResults(results: CalculationResult[]) {
  const supabase = getSupabaseClient()
  const insertData = results.map(result => ({
    ...result,
    created_at: new Date().toISOString()
  }))

  const { error } = await supabase
    .from('results')
    .insert(insertData)

  if (error) {
    throw new Error(`保存计算结果失败: ${error.message}`)
  }
}

// 获取所有计算结果
export async function getAllResults(): Promise<Result[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`获取计算结果失败: ${error.message}`)
  }

  return data || []
}

// 根据条件筛选计算结果
export async function getResultsWithFilters(filters: {
  city?: string
  year?: string
  employeeName?: string
}): Promise<Result[]> {
  const supabase = getSupabaseClient()
  let query = supabase
    .from('results')
    .select('*')

  if (filters.city) {
    query = query.eq('city_name', filters.city)
  }

  if (filters.year) {
    query = query.eq('year', filters.year)
  }

  if (filters.employeeName) {
    query = query.ilike('employee_name', `%${filters.employeeName}%`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    throw new Error(`获取筛选结果失败: ${error.message}`)
  }

  return data || []
}

// 获取统计信息
export async function getResultsStatistics(filters: {
  city?: string
  year?: string
  employeeName?: string
}): Promise<{
  totalEmployees: number
  totalCompanyFee: number
  avgCompanyFee: number
}> {
  const results = await getResultsWithFilters(filters)

  const uniqueEmployees = new Set(results.map(r => r.employee_name))
  const totalCompanyFee = results.reduce((sum, r) => sum + r.company_fee, 0)

  return {
    totalEmployees: uniqueEmployees.size,
    totalCompanyFee: Math.round(totalCompanyFee * 100) / 100,
    avgCompanyFee: results.length > 0
      ? Math.round((totalCompanyFee / results.length) * 100) / 100
      : 0
  }
}