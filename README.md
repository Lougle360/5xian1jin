# 五险一金计算器

一个基于 Next.js 的企业社保公积金费用计算工具，支持多城市社保标准，根据员工工资数据自动计算公司应缴纳的社保公积金费用。

## 功能特点

- 📊 支持多城市社保标准配置
- 📈 自动计算年度月平均工资
- 💰 智能匹配缴费基数上下限
- 📋 Excel 文件批量导入数据
- 🔍 多维度筛选查询结果
- 📱 响应式设计，支持移动端

## 技术栈

- **前端框架**: Next.js 15
- **UI/样式**: Tailwind CSS
- **数据库**: Supabase
- **Excel 处理**: SheetJS (xlsx)
- **类型安全**: TypeScript

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd 5xian1jin
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 项目信息：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 4. 设置 Supabase 数据库

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在项目的 SQL 编辑器中执行 `database-init.sql` 中的 SQL 命令
3. 确保表的 Row Level Security (RLS) 已正确配置

### 5. 运行项目

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

### 数据准备

#### 1. 城市标准文件 (cities.xlsx)

包含以下字段：

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| city_name | 文本 | 城市名称 | 北京 |
| year | 文本 | 年份 | 2024 |
| base_min | 数字 | 社保基数下限 | 5360 |
| base_max | 数字 | 社保基数上限 | 33891 |
| rate | 数字 | 综合缴纳比例 | 0.15 |

#### 2. 员工工资文件 (salaries.xlsx)

包含以下字段：

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| employee_id | 文本 | 员工工号 | EMP001 |
| employee_name | 文本 | 员工姓名 | 张三 |
| month | 文本 | 年份月份 (YYYYMM) | 202401 |
| salary_amount | 数字 | 该月工资金额 | 10000 |

### 操作流程

1. **数据上传**
   - 访问 `/upload` 页面
   - 上传 cities.xlsx 和 salaries.xlsx 文件
   - 选择要计算的城市和年份
   - 点击"开始计算"

2. **结果查询**
   - 访问 `/results` 页面
   - 使用筛选功能查找特定记录
   - 查看统计汇总信息

## 计算规则

1. **年度月平均工资**：按员工姓名和年份分组，计算该员工该年度的月平均工资
2. **缴费基数确定**：
   - 如果年度月平均工资 < 基数下限，使用基数下限
   - 如果年度月平均工资 > 基数上限，使用基数上限
   - 否则使用年度月平均工资
3. **公司缴纳金额**：缴费基数 × 综合缴纳比例

## 项目结构

```
5xian1jin/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── page.tsx        # 主页
│   │   ├── upload/         # 上传页面
│   │   └── results/        # 结果页面
│   ├── components/         # React 组件
│   │   ├── Card.tsx        # 功能卡片
│   │   ├── UploadButton.tsx # 上传按钮
│   │   ├── CitySelector.tsx # 城市选择器
│   │   ├── FilterPanel.tsx # 筛选面板
│   │   ├── DataTable.tsx   # 数据表格
│   │   └── StatisticsCards.tsx # 统计卡片
│   └── lib/                # 工具库
│       ├── supabase.ts     # Supabase 客户端
│       ├── excelParser.ts  # Excel 解析
│       ├── calculations.ts # 计算逻辑
│       └── database.ts     # 数据库操作
├── database-init.sql       # 数据库初始化脚本
└── README.md              # 项目说明文档
```

## 部署

项目可以部署到 Vercel、Netlify 等支持 Next.js 的平台。部署时记得配置环境变量。

## 注意事项

1. 确保 Supabase 项目的匿名密钥有足够的权限访问数据表
2. Excel 文件必须按照指定格式准备
3. 月份格式必须为 YYYYMM（如 202401）
4. 缴费比例应为 0-1 之间的小数

## 许可证

MIT