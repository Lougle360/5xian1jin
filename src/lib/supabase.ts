import { createClient } from '@supabase/supabase-js'

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// 数据库表类型定义
export interface City {
  id: number
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
}

export interface Salary {
  id: number
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
}

export interface Result {
  id: number
  employee_name: string
  city_name: string
  year: string
  avg_salary: number
  contribution_base: number
  company_fee: number
  created_at: string
}