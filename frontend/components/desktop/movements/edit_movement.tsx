// components/desktop/movements/edit_movement.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BankAccount, UpdateMovementData } from "@/lib/api/bank-api";
import { ArrowLeft } from "lucide-react";

export interface EditMovementProps {
  formData: UpdateMovementData;
  handleChange: (e: React.ChangeEvent<any>) => void;
  accounts: BankAccount[];
  balanceInput: string;
  handleSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  onBack?: () => void;
  onCancel?: () => void;
  error: string;
}

export function EditMovement({
  formData,
  handleChange,
  accounts,
  balanceInput: initialBalanceInput,
  handleSubmit,
  submitting,
  onBack,
  onCancel,
  error
}: EditMovementProps) {
  const [balanceInput, setBalanceInput] = useState(initialBalanceInput);

  const convertValue = (value: string) => {
    const cleanValue = value.replace(',', '.').replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return cleanValue;
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBalanceInput(value);
    
    const convertedValue = convertValue(value);
    const syntheticEvent = {
      target: {
        name: 'amount',
        value: convertedValue
      }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);
  };
  
  const handleBalanceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    const currentValue = balanceInput;
    const isDigit = /^[0-9]$/.test(e.key);
    const isCommaOrPeriod = e.key === ',' || e.key === '.';
    const isAllowedKey = allowedKeys.includes(e.key);
    
    const input = e.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    
    if (isAllowedKey) return;
    
    if (isCommaOrPeriod) {
      if (currentValue.includes('.') || currentValue.includes(',')) {
        e.preventDefault();
        return;
      }
    }
    
    if (isDigit) {
      const hasDecimal = currentValue.includes('.') || currentValue.includes(',');
      if (hasDecimal) {
        const decimalIndex = Math.max(currentValue.indexOf('.'), currentValue.indexOf(','));
        
        if (cursorPosition > decimalIndex) {
          const digitsAfterDecimal = currentValue.length - decimalIndex - 1;
          if (digitsAfterDecimal >= 2) {
            e.preventDefault();
            return;
          }
        }
      }
    }
    
    if (!isDigit && !isCommaOrPeriod) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 mb-6">
        <Button size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="accountId">Account *</Label>
              <select id="accountId" name="accountId" value={formData.accountId}
                onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm" required>
                <option value={0}>Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountName} - {account.iban}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="type">Movement Type *</Label>
              <select id="type" name="type" value={formData.type}
                onChange={handleChange} className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm"
              >
                <option value="SHOPPING">Shopping</option>
                <option value="NET">Internet</option>
                <option value="TECH">Tech</option>
                <option value="FOOD_DRINKS">Food & Drinks</option>
                <option value="TRANSPORT">Transport</option>
                <option value="ENTERTAINMENT">Entertainment</option>
                <option value="HEALTH">Health</option>
                <option value="UTILITIES">Utilities</option>
                <option value="EDUCATION">Education</option>
                <option value="STREAMING_SERVICES">Streaming</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter movement description"
              className="mt-1 shadow-sm"
              maxLength={255}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum 255 characters. Current length: {formData.description.length}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="balance">Amount *</Label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm mt-0.5">
                  €
                </span>
                <Input id="balance" name="balance" type="text" value={balanceInput}
                  onChange={handleBalanceChange} onKeyDown={handleBalanceKeyDown} placeholder="0.00" className="shadow-sm pl-7 pr-12"/>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs mt-0.5">
                  EUR
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input id="date" name="date" type="date" 
              value={formData.date} onChange={handleChange} className="mt-1" required/>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4 justify-end">
            <Button type="submit" disabled={submitting} className="p-2">
              {submitting ? "Updating..." : "Update Movement"}
            </Button>
            <Button type="button" variant="destructive" onClick={onCancel} className="p-2">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}