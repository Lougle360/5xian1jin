-- Supabase SQL 命令
-- 请在 Supabase 项目的 SQL 编辑器中执行以下命令

-- 创建 exec_sql 函数（用于通过 RPC 执行 SQL 语句）
-- 注意：此函数需要 SECURITY DEFINER 权限来执行 DDL 语句
-- 此函数支持多语句 SQL，通过分号分隔
CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  statements TEXT[];
  stmt TEXT;
  cleaned_stmt TEXT;
BEGIN
  -- 将 SQL 按分号分割成多个语句
  statements := string_to_array(sql, ';');
  
  -- 执行每个语句
  FOREACH stmt IN ARRAY statements
  LOOP
    -- 去除前后空白
    cleaned_stmt := trim(stmt);
    
    -- 跳过空语句、纯注释和只包含空白/换行的语句
    IF cleaned_stmt != '' 
       AND NOT (cleaned_stmt ~ '^\s*--') 
       AND NOT (cleaned_stmt ~ '^\s*$') THEN
      BEGIN
        EXECUTE cleaned_stmt;
      EXCEPTION WHEN OTHERS THEN
        -- 对于某些错误（如对象已存在），只记录警告
        -- 对于其他错误，抛出异常
        IF SQLSTATE = '42P07' OR SQLSTATE = '42710' THEN
          -- 表/对象已存在，只记录警告
          RAISE WARNING '对象已存在，跳过: %', SQLERRM;
        ELSE
          -- 其他错误，重新抛出
          RAISE;
        END IF;
      END;
    END IF;
  END LOOP;
END;
$$;

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
  month TEXT NOT NULL, -- 格式: YYYYMM
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

-- 插入示例数据（可选）
INSERT INTO cities (city_name, year, base_min, base_max, rate) VALUES
('北京', '2024', 5360, 33891, 0.15),
('上海', '2024', 6520, 36549, 0.145),
('深圳', '2024', 3523, 26421, 0.142)
ON CONFLICT DO NOTHING;

-- 设置行级安全策略 (RLS)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（用于开发环境，生产环境应更严格）
CREATE POLICY "Allow all operations on cities" ON cities
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on salaries" ON salaries
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on results" ON results
  FOR ALL USING (true);