import * as XLSX from 'xlsx'
import { City, Salary } from './supabase'

export interface ParsedCitiesData {
  cities: Omit<City, 'id'>[]
  errors: string[]
}

export interface ParsedSalariesData {
  salaries: Omit<Salary, 'id'>[]
  errors: string[]
}

export function parseCitiesExcel(file: File): Promise<ParsedCitiesData> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    const errors: string[] = []

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, {
          type: 'binary',
          codepage: 65001  // UTF-8编码
        })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        const cities: Omit<City, 'id'>[] = []

        jsonData.forEach((row, index) => {
          // 验证必填字段
          if (!row.city_name || !row.year || !row.base_min || !row.base_max || !row.rate) {
            errors.push(`第${index + 2}行：数据不完整，缺少必填字段`)
            return
          }

          // 验证数据类型
          const base_min = Number(row.base_min)
          const base_max = Number(row.base_max)
          const rate = Number(row.rate)

          if (isNaN(base_min) || isNaN(base_max) || isNaN(rate)) {
            errors.push(`第${index + 2}行：基数或比例必须为数字`)
            return
          }

          if (base_min > base_max) {
            errors.push(`第${index + 2}行：基数下限不能大于上限`)
            return
          }

          if (rate <= 0 || rate > 1) {
            errors.push(`第${index + 2}行：缴纳比例必须在0到1之间`)
            return
          }

          cities.push({
            city_name: String(row.city_name),
            year: String(row.year),
            base_min,
            base_max,
            rate
          })
        })

        resolve({ cities, errors })
      } catch (error) {
        errors.push(`文件解析失败: ${error}`)
        resolve({ cities: [], errors })
      }
    }

    reader.readAsBinaryString(file)
  })
}

export function parseSalariesExcel(file: File): Promise<ParsedSalariesData> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    const errors: string[] = []

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, {
          type: 'binary',
          codepage: 65001  // UTF-8编码
        })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        const salaries: Omit<Salary, 'id'>[] = []

        jsonData.forEach((row, index) => {
          // 验证必填字段
          if (!row.employee_id || !row.employee_name || !row.month || !row.salary_amount) {
            errors.push(`第${index + 2}行：数据不完整，缺少必填字段`)
            return
          }

          // 验证工资金额
          const salary_amount = Number(row.salary_amount)
          if (isNaN(salary_amount) || salary_amount < 0) {
            errors.push(`第${index + 2}行：工资金额必须为非负数`)
            return
          }

          // 验证月份格式 (YYYYMM)
          const monthRegex = /^\d{4}(0[1-9]|1[0-2])$/
          if (!monthRegex.test(String(row.month))) {
            errors.push(`第${index + 2}行：月份格式不正确，应为YYYYMM（如202401）`)
            return
          }

          salaries.push({
            employee_id: String(row.employee_id),
            employee_name: String(row.employee_name),
            month: String(row.month),
            salary_amount
          })
        })

        resolve({ salaries, errors })
      } catch (error) {
        errors.push(`文件解析失败: ${error}`)
        resolve({ salaries: [], errors })
      }
    }

    reader.readAsBinaryString(file)
  })
}