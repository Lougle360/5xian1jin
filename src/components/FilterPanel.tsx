interface FilterPanelProps {
  filters: {
    city: string
    year: string
    employeeName: string
  }
  onFiltersChange: (filters: any) => void
  results: any[]
  disabled?: boolean
}

export function FilterPanel({ filters, onFiltersChange, results, disabled = false }: FilterPanelProps) {
  // 获取可用的城市列表
  const availableCities = Array.from(new Set(results.map(r => r.city_name))).sort()

  // 获取可用的年份列表
  const availableYears = Array.from(new Set(results.map(r => r.year))).sort().reverse()

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      city: '',
      year: '',
      employeeName: ''
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">筛选条件</h2>
        <button
          onClick={clearFilters}
          disabled={disabled}
          className="mt-3 sm:mt-0 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          清除筛选
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-2">
            城市
          </label>
          <select
            id="city-filter"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">全部城市</option>
            {availableCities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-2">
            年份
          </label>
          <select
            id="year-filter"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">全部年份</option>
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="employee-filter" className="block text-sm font-medium text-gray-700 mb-2">
            员工姓名
          </label>
          <input
            type="text"
            id="employee-filter"
            value={filters.employeeName}
            onChange={(e) => handleFilterChange('employeeName', e.target.value)}
            disabled={disabled}
            placeholder="搜索员工姓名..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}