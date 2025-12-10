import { getAvailableCities } from '@/lib/calculations'

interface CitySelectorProps {
  cities: any[]
  selectedCity: string
  selectedYear: string
  onCityChange: (city: string) => void
  onYearChange: (year: string) => void
  disabled?: boolean
}

export function CitySelector({
  cities,
  selectedCity,
  selectedYear,
  onCityChange,
  onYearChange,
  disabled = false
}: CitySelectorProps) {
  // 获取可用的城市列表
  const availableCities = getAvailableCities(cities)

  // 获取选中城市的可用年份
  const availableYears = cities
    .filter(city => city.city_name === selectedCity)
    .map(city => city.year)
    .sort((a, b) => b.localeCompare(a)) // 倒序排列

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="city-select" className="block text-sm font-medium text-gray-300 mb-2">
          选择城市
        </label>
        <div className="relative">
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => {
              onCityChange(e.target.value)
              onYearChange('') // 清空年份选择
            }}
            disabled={disabled}
            className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <option value="" className="bg-gray-800">请选择城市</option>
            {Array.from(new Set(availableCities.map(c => c.city_name))).map(cityName => (
              <option key={cityName} value={cityName} className="bg-gray-800">
                {cityName}
              </option>
            ))}
          </select>
          {/* 下拉箭头 */}
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div>
        <label htmlFor="year-select" className="block text-sm font-medium text-gray-300 mb-2">
          选择年份
        </label>
        <div className="relative">
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            disabled={disabled || !selectedCity}
            className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <option value="" className="bg-gray-800">请先选择城市</option>
            {availableYears.map(year => (
              <option key={year} value={year} className="bg-gray-800">
                {year}
              </option>
            ))}
          </select>
          {/* 下拉箭头 */}
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}