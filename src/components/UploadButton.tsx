interface UploadButtonProps {
  onFileSelect: (file: File) => void
  accept?: string
  disabled?: boolean
  label: string
}

export function UploadButton({ onFileSelect, accept = '.xlsx', disabled = false, label }: UploadButtonProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
    // 清空input，允许重复选择同一文件
    e.target.value = ''
  }

  return (
    <label className="relative cursor-pointer group">
      <input
        type="file"
        className="sr-only"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
      />
      <div className="relative inline-flex items-center w-full px-6 py-3 border-2 border-dashed border-white border-opacity-30 rounded-xl text-white bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed">
        {/* 发光效果 */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>

        <div className="relative flex items-center justify-center">
          <svg className="w-6 h-6 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-center">{label}</span>
        </div>
      </div>
    </label>
  )
}