
# 五险一金计算器 Web 应用

## 项目概述
构建一个基于 Next.js 的五险一金计算器Web应用，支持多城市社保标准，根据员工工资数据计算公司应缴纳的社保公积金费用。

## 技术栈
- **前端框架**: Next.js
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase
- **文件处理**: SheetJS (xlsx解析)

## 数据库设计

### cities 表 (城市标准表)
```sql
- id (主键, int)
- city_name (城市名, text)
- year (年份, text)
- base_min (社保基数下限, int)
- base_max (社保基数上限, int)
- rate (综合缴纳比例, float, 例如 0.15)
```

### salaries 表 (员工工资表)
```sql
- id (主键, int)
- employee_id (员工工号, text)
- employee_name (员工姓名, text)
- month (年份月份, YYYYMM, text)
- salary_amount (该月工资金额, int)
```

### results 表 (计算结果表)
```sql
- id (主键, int)
- employee_name (员工姓名, text)
- city_name (城市名称, text)
- year (年份, text)
- avg_salary (年度月平均工资, float)
- contribution_base (最终缴费基数, float)
- company_fee (公司缴纳金额, float)
- created_at (计算时间, timestamp)
```

## 核心业务逻辑

### 计算函数执行步骤
1. 从 salaries 表中读取所有数据
2. 按员工姓名、年份分组，计算出每位员工每年的"年度月平均工资"
3. 获取最新年份的 cities 数据，支持多城市
4. 对每位员工，按城市分别进行计算：
   - 将"年度月平均工资"与对应城市的基数上下限比较
   - 确定最终缴费基数（低于下限用下限，高于上限用上限，在中间用平均工资）
   - 根据"最终缴费基数"和 rate 计算公司应缴纳金额
5. 将计算结果存入 results 表

### 缴费基数规则
```
如果 年度月平均工资 < base_min: 缴费基数 = base_min
如果 年度月平均工资 > base_max: 缴费基数 = base_max
否则: 缴费基数 = 年度月平均工资
公司缴纳金额 = 缴费基数 × rate
```

## 前端页面功能

### 1. 主页 (/)
**定位**: 应用入口页面和导航中枢
**布局**:
- 两个并排或垂直排列的功能卡片
- 简洁现代的设计风格

**功能卡片**:
- **卡片一**: "数据上传" - 可点击链接，跳转到 /upload
- **卡片二**: "结果查询" - 可点击链接，跳转到 /results

### 2. 数据上传与操作页 (/upload)
**定位**: 后台操作控制面板，数据准备和计算触发

**功能**:
- **上传数据按钮**:
  - 支持 cities.xlsx 和 salaries.xlsx 文件上传
  - 解析 Excel 文件并插入到 Supabase 对应表
  - 显示上传成功/失败反馈
- **城市选择下拉框**: 选择计算使用的城市
- **执行计算按钮**:
  - 触发核心业务逻辑计算
  - 按选择城市计算所有员工的社保费用
  - 存储计算结果到 results 表
  - 显示计算进度和结果

### 3. 结果查询与展示页 (/results)
**定位**: 计算成果的最终展示页面

**功能**:
- 自动从 results 表获取所有计算结果
- 筛选功能：
  - 按城市筛选
  - 按年份筛选
  - 按员工姓名搜索
- 使用 Tailwind CSS 构建响应式表格
- 表格字段：员工姓名、城市、年份、平均工资、缴费基数、公司缴纳金额、计算时间
- 支持排序功能
- 总计统计：显示总员工数、总缴纳金额

## 开发任务清单 (TodoList)

### 环境搭建阶段
- [ ] 初始化 Next.js 项目
- [ ] 安装和配置 Tailwind CSS
- [ ] 安装 Supabase 客户端库
- [ ] 安装 SheetJS (xlsx) 库
- [ ] 配置环境变量 (Supabase URL, Key)
- [ ] 创建项目文件夹结构

### Supabase 数据库设置
- [ ] 创建 Supabase 项目
- [ ] 创建 cities 表 (id, city_name, year, base_min, base_max, rate)
- [ ] 创建 salaries 表 (id, employee_id, employee_name, month, salary_amount)
- [ ] 创建 results 表 (id, employee_name, city_name, year, avg_salary, contribution_base, company_fee, created_at)
- [ ] 设置表的访问权限 (RLS)

### 核心功能开发
- [ ] 创建 Supabase 连接和操作工具函数
- [ ] 开发 Excel 文件解析函数 (cities.xlsx, salaries.xlsx)
- [ ] 开发数据插入函数 (cities, salaries 表)
- [ ] 开发核心计算函数 (分组、平均工资、基数确定、费用计算)
- [ ] 开发结果存储函数 (results 表)

### 前端页面开发
- [ ] 创建主页面 (/) 和导航卡片组件
- [ ] 创建上传页面 (/upload)
  - [ ] 文件上传组件
  - [ ] Excel 解析和验证
  - [ ] 城市选择组件
  - [ ] 执行计算按钮和进度显示
- [ ] 创建结果页面 (/results)
  - [ ] 数据获取和筛选功能
  - [ ] 响应式表格组件
  - [ ] 搜索和排序功能
  - [ ] 统计信息显示

### 样式和用户体验
- [ ] 设计整体 UI 风格和色彩方案
- [ ] 实现响应式布局
- [ ] 添加加载状态和错误处理
- [ ] 添加操作反馈和提示信息

### 测试和优化
- [ ] 功能测试 (数据上传、计算、查询)
- [ ] 边界情况测试 (空数据、错误格式等)
- [ ] 性能优化 (大数据量处理)
- [ ] 用户界面优化

### 部署和文档
- [ ] 项目部署到 Vercel
- [ ] 环境变量配置
- [ ] 用户使用说明文档
- [ ] 代码注释和文档完善

## 重要注意事项

1. **数据验证**: 上传的 Excel 文件需要进行格式验证
2. **错误处理**: 需要完善的错误处理机制和用户反馈
3. **性能考虑**: 大量数据计算时需要考虑性能优化
4. **数据安全**: 确保 Supabase 的数据访问安全
5. **用户体验**: 提供清晰的操作指引和结果展示

## 文件结构建议
```
/
├── pages/
│   ├── index.js (主页)
│   ├── upload.js (上传页面)
│   └── results.js (结果页面)
├── components/
│   ├── Card.js (卡片组件)
│   ├── UploadButton.js (上传按钮)
│   ├── DataTable.js (数据表格)
│   └── FilterPanel.js (筛选面板)
├── lib/
│   ├── supabase.js (Supabase 连接)
│   ├── calculations.js (计算逻辑)
│   └── excelParser.js (Excel 解析)
├── styles/
│   └── globals.css
├── .env.local
└── package.json
```