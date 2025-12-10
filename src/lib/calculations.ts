import { City, Salary, Result } from './supabase'

export interface CalculationInput {
  salaries: Salary[]
  cities: City[]
  selectedCity: string
  selectedYear: string
}

export interface EmployeeYearlySalary {
  employee_name: string
  year: string
  avg_salary: number
}

export interface CalculationResult {
  employee_name: string
  city_name: string
  year: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}

// 计算每位员工的年度月平均工资
export function calculateYearlyAverageSalaries(salaries: Salary[]): EmployeeYearlySalary[] {
  const employeeMap = new Map<string, Map<string, number[]>>()

  // 按员工和年份分组
  salaries.forEach(salary => {
    const year = salary.month.substring(0, 4)

    if (!employeeMap.has(salary.employee_name)) {
      employeeMap.set(salary.employee_name, new Map())
    }

    const yearMap = employeeMap.get(salary.employee_name)!
    if (!yearMap.has(year)) {
      yearMap.set(year, [])
    }

    yearMap.get(year)!.push(salary.salary_amount)
  })

  // 计算年度月平均工资
  const results: EmployeeYearlySalary[] = []

  employeeMap.forEach((yearMap, employeeName) => {
    yearMap.forEach((salaryList, year) => {
      const totalSalary = salaryList.reduce((sum, salary) => sum + salary, 0)
      const avgSalary = totalSalary / salaryList.length

      results.push({
        employee_name: employeeName,
        year,
        avg_salary: Math.round(avgSalary * 100) / 100 // 保留两位小数
      })
    })
  })

  return results
}

// 执行社保计算
export function calculateSocialInsurance(input: CalculationInput): CalculationResult[] {
  const { salaries, cities, selectedCity, selectedYear } = input

  // 获取选中城市和年份的配置
  const cityConfig = cities.find(
    city => city.city_name === selectedCity && city.year === selectedYear
  )

  if (!cityConfig) {
    throw new Error(`未找到 ${selectedCity} ${selectedYear} 的社保配置`)
  }

  // 计算年度月平均工资
  const yearlySalaries = calculateYearlyAverageSalaries(salaries)

  // 筛选指定年份的数据
  const targetYearSalaries = yearlySalaries.filter(
    salary => salary.year === selectedYear
  )

  // 计算缴费基数和公司缴纳金额
  const results: CalculationResult[] = []

  targetYearSalaries.forEach(salary => {
    let contributionBase: number

    // 根据基数规则确定缴费基数
    if (salary.avg_salary < cityConfig.base_min) {
      contributionBase = cityConfig.base_min
    } else if (salary.avg_salary > cityConfig.base_max) {
      contributionBase = cityConfig.base_max
    } else {
      contributionBase = salary.avg_salary
    }

    // 计算公司缴纳金额
    const companyFee = contributionBase * cityConfig.rate

    results.push({
      employee_name: salary.employee_name,
      city_name: selectedCity,
      year: selectedYear,
      avg_salary: salary.avg_salary,
      contribution_base: Math.round(contributionBase * 100) / 100,
      company_fee: Math.round(companyFee * 100) / 100
    })
  })

  return results
}

// 获取可用的城市列表
export function getAvailableCities(cities: City[]): Array<{city_name: string; year: string}> {
  const uniqueCities = new Set<string>()
  const result: Array<{city_name: string; year: string}> = []

  cities
    .sort((a, b) => b.year.localeCompare(a.year)) // 按年份倒序
    .forEach(city => {
      const key = `${city.city_name}-${city.year}`
      if (!uniqueCities.has(key)) {
        uniqueCities.add(key)
        result.push({
          city_name: city.city_name,
          year: city.year
        })
      }
    })

  return result
}