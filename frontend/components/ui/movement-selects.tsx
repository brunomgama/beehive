// components/ui/movement-selects.tsx
import React from 'react'
import { MOVEMENT_TYPES, MOVEMENT_STATUSES, MOVEMENT_CATEGORIES, MOVEMENT_RECURRENCES, SelectOption} from '@/lib/bank/movement-constants'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

function Select({ label, error, children, className = '', ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium mb-1">
          {label} {props.required && '*'}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

function renderOptions<T extends string>(options: SelectOption<T>[]) {
  return options.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))
}

export function MovementTypeSelect({ value, onChange, includeEmpty = false,emptyLabel = 'Select type', ...props }: Omit<SelectProps, 'children'> & { 
  includeEmpty?: boolean
  emptyLabel?: string
}) {
  return (
    <Select value={value} onChange={onChange} {...props}>
      {includeEmpty && <option value="">{emptyLabel}</option>}
      {renderOptions(MOVEMENT_TYPES)}
    </Select>
  )
}

export function MovementStatusSelect({ value, onChange, includeEmpty = false,emptyLabel = 'Select status', ...props }: Omit<SelectProps, 'children'> & { 
  includeEmpty?: boolean
  emptyLabel?: string
}) {
  return (
    <Select value={value} onChange={onChange} {...props}>
      {includeEmpty && <option value="">{emptyLabel}</option>}
      {renderOptions(MOVEMENT_STATUSES)}
    </Select>
  )
}

export function MovementCategorySelect({ value, onChange, includeEmpty = false,emptyLabel = 'Select category', ...props }: Omit<SelectProps, 'children'> & { 
  includeEmpty?: boolean
  emptyLabel?: string
}) {
  return (
    <Select value={value} onChange={onChange} {...props}>
      {includeEmpty && <option value="">{emptyLabel}</option>}
      {renderOptions(MOVEMENT_CATEGORIES)}
    </Select>
  )
}

export function MovementRecurrenceSelect({ value, onChange, includeEmpty = false,emptyLabel = 'Select recurrence', ...props }: Omit<SelectProps, 'children'> & { 
  includeEmpty?: boolean
  emptyLabel?: string
}) {
  return (
    <Select value={value} onChange={onChange} {...props}>
      {includeEmpty && <option value="">{emptyLabel}</option>}
      {renderOptions(MOVEMENT_RECURRENCES)}
    </Select>
  )
}

interface MobileSelectProps extends Omit<SelectProps, 'children'> {
  includeEmpty?: boolean
  emptyLabel?: string
}

export function MovementCategorySelectMobile({ value, onChange,className = '', ...props }: MobileSelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`bg-transparent text-text-color text-lg focus:outline-none w-full pr-2 ${className}`}
      {...props}
    >
      {renderOptions(MOVEMENT_CATEGORIES)}
    </select>
  )
}