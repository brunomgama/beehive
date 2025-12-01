import { forwardRef } from "react"

interface CurrencyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, placeholder = "0.00", className = "" }, ref) => {
    const convertValue = (inputValue: string) => {
      const cleanValue = inputValue.replace(',', '.').replace(/[^0-9.]/g, '')
      
      // Ensure only one decimal point
      const parts = cleanValue.split('.')
      if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('')
      }
      
      return cleanValue
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const converted = convertValue(e.target.value)
      onChange(converted)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
      ]
      
      const isDigit = /^[0-9]$/.test(e.key)
      const isCommaOrPeriod = e.key === ',' || e.key === '.'
      const isAllowedKey = allowedKeys.includes(e.key)
      
      if (isAllowedKey) return
      
      const digitCount = value.replace(/[^0-9]/g, '').length
      if (isDigit && digitCount >= 12) {
        e.preventDefault()
        return
      }
      
      // Prevent multiple decimal separators
      if (isCommaOrPeriod && (value.includes('.') || value.includes(','))) {
        e.preventDefault()
        return
      }
      
      // Limit to 2 decimal places
      if (isDigit && value.includes('.')) {
        const input = e.target as HTMLInputElement
        const cursorPosition = input.selectionStart || 0
        const decimalIndex = value.indexOf('.')
        
        if (cursorPosition > decimalIndex) {
          const digitsAfterDecimal = value.length - decimalIndex - 1
          if (digitsAfterDecimal >= 2) {
            e.preventDefault()
            return
          }
        }
      }
      
      if (!isDigit && !isCommaOrPeriod) {
        e.preventDefault()
      }
    }

    const isLarge = className.includes('text-5xl')
    const fontSize = isLarge ? 'text-5xl' : 'text-lg'
    const displayValue = value || placeholder
    const textColor = value ? 'text-foreground' : 'text-muted-foreground'

    return (
      <div className="w-full flex justify-center">
        <div className="relative inline-block text-center">
          {/* Display layer - shows € and value */}
          <div className={`${fontSize} font-bold ${textColor} pointer-events-none select-none whitespace-nowrap`}>
            € {displayValue}
          </div>
          
          {/* Input layer - invisible but captures input */}
          <input ref={ref} type="text" inputMode="decimal" value={value} onChange={handleChange}
           onKeyDown={handleKeyDown} className="absolute inset-0 w-full h-full opacity-0 cursor-text" aria-label="Amount"/>
        </div>
      </div>
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"