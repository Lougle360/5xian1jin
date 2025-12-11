const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 使用 service role key 如果可用（用于执行 SQL），否则使用 anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey
const supabase = createClient(supabaseUrl, supabaseKey)

// SQL 语句来自 database-init.sql
const initSQL = `
-- 创建城市标准表
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INTEGER NOT NULL,
  base_max INTEGER NOT NULL,
  rate DECIMAL(5,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建员工工资表
CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建计算结果表
CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  avg_salary DECIMAL(12,2) NOT NULL,
  contribution_base DECIMAL(12,2) NOT NULL,
  company_fee DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_cities_city_year ON cities(city_name, year);
CREATE INDEX IF NOT EXISTS idx_salaries_employee_name ON salaries(employee_name);
CREATE INDEX IF NOT EXISTS idx_salaries_month ON salaries(month);
CREATE INDEX IF NOT EXISTS idx_results_city_year ON results(city_name, year);
CREATE INDEX IF NOT EXISTS idx_results_employee_name ON results(employee_name);

-- 插入示例数据
INSERT INTO cities (city_name, year, base_min, base_max, rate) VALUES
('北京', '2024', 5360, 33891, 0.15),
('上海', '2024', 6520, 36549, 0.145),
('深圳', '2024', 3523, 26421, 0.142);

-- 设置行级安全策略
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的安全策略
CREATE POLICY IF NOT EXISTS "Allow all operations on cities" ON cities FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on salaries" ON salaries FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on results" ON results FOR ALL USING (true);
`

async function initDatabase() {
  console.log('正在初始化数据库...')

  // 检查必要的环境变量
  if (!supabaseUrl) {
    console.error('❌ 错误: NEXT_PUBLIC_SUPABASE_URL 未设置')
    return
  }

  if (!supabaseAnonKey && !supabaseServiceKey) {
    console.error('❌ 错误: 需要设置 NEXT_PUBLIC_SUPABASE_ANON_KEY 或 SUPABASE_SERVICE_ROLE_KEY')
    return
  }

  try {
    // 尝试通过 RPC 调用 exec_sql 函数
    console.log('正在通过 RPC 调用 exec_sql 函数执行 SQL...')
    const { data, error } = await supabase.rpc('exec_sql', { sql: initSQL })

    if (error) {
      // 检查是否是函数不存在的错误
      if (error.message && (
        error.message.includes('function exec_sql') ||
        error.message.includes('does not exist') ||
        error.code === '42883' // PostgreSQL function does not exist error code
      )) {
        console.error('❌ 错误: exec_sql 函数不存在')
        console.log('\n解决方案：')
        console.log('1. 访问 https://supabase.com/dashboard')
        console.log('2. 选择你的项目')
        console.log('3. 进入 SQL Editor')
        console.log('4. 首先执行 database-init.sql 中创建 exec_sql 函数的 SQL 语句')
        console.log('5. 然后重新运行此脚本')
        console.log('\n或者直接手动执行 database-init.sql 中的所有 SQL 语句')
        return
      }

      console.error('❌ 数据库初始化失败:', error)
      console.log('\n请手动执行以下步骤：')
      console.log('1. 访问 https://supabase.com/dashboard')
      console.log('2. 选择你的项目')
      console.log('3. 进入 SQL Editor')
      console.log('4. 粘贴并执行 database-init.sql 中的 SQL 语句')
      return
    }

    console.log('✅ 数据库初始化成功！')

    // 验证表是否创建成功
    const { data: cities, error: citiesError } = await supabase.from('cities').select('*')
    if (citiesError) {
      console.error('查询 cities 表失败:', citiesError)
    } else {
      console.log('✅ cities 表已创建，包含', cities.length, '条记录')
    }

  } catch (err) {
    console.error('执行出错:', err)
    console.log('\n请手动执行 database-init.sql 中的 SQL 语句')
  }
}

initDatabase()