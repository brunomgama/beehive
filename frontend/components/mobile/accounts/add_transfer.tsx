'use client'

import { useState, useEffect } from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRightLeft } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/contexts/theme-context"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"
import { getButtonStyle } from "@/lib/themes"
import { movementApi, MovementStatus } from "@/lib/api/bank/movements-api"
import { CurrencyInput } from "@/lib/util/currency-input"

interface AddTransferDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: BankAccount[]
  defaultAccountId?: number
  onSuccess?: () => void
}

export function AddTransferDrawer({ open, onOpenChange, accounts, defaultAccountId, onSuccess }: AddTransferDrawerProps) {
  const { theme } = useTheme()
  const [fromAccountId, setFromAccountId] = useState<number>(defaultAccountId || 0)
  const [toAccountId, setToAccountId] = useState<number>(0)
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState('Transfer')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [status, setStatus] = useState<MovementStatus>('CONFIRMED')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (defaultAccountId) {
      setFromAccountId(defaultAccountId)
      const otherAccount = accounts.find(acc => acc.id !== defaultAccountId)
      if (otherAccount?.id) {
        setToAccountId(otherAccount.id)
      }
    }
  }, [defaultAccountId, accounts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numAmount = parseFloat(amount) || 0
    
    if (!fromAccountId || fromAccountId === 0 || !toAccountId || toAccountId === 0 || !numAmount) {
      return
    }

    if (fromAccountId === toAccountId) {
      alert('Cannot transfer to the same account')
      return
    }

    setLoading(true)
    
    try {
      const expenseData = {
        accountId: fromAccountId,
        category: 'INVESTMENTS' as const,
        type: 'EXPENSE' as const,
        amount: numAmount,
        description: `${description} to ${accounts.find(a => a.id === toAccountId)?.accountName}`,
        date: date,
        status: status
      }

      const expenseResult = await movementApi.create(expenseData)
      
      if (!expenseResult.data) {
        alert('Failed to create transfer expense: ' + expenseResult.error)
        setLoading(false)
        return
      }

      const incomeData = {
        accountId: toAccountId,
        category: 'INVESTMENTS' as const,
        type: 'INCOME' as const,
        amount: numAmount,
        description: `${description} from ${accounts.find(a => a.id === fromAccountId)?.accountName}`,
        date: date,
        status: status
      }

      const incomeResult = await movementApi.create(incomeData)
      
      if (!incomeResult.data) {
        alert('Failed to create transfer income: ' + incomeResult.error)
        setLoading(false)
        return
      }

      const fromAccount = accounts.find(a => a.id === fromAccountId)
      const toAccount = accounts.find(a => a.id === toAccountId)

      if (fromAccount && toAccount) {
        await bankAccountApi.update(fromAccountId, {
          ...fromAccount,
          balance: fromAccount.balance - numAmount
        })

        await bankAccountApi.update(toAccountId, {
          ...toAccount,
          balance: toAccount.balance + numAmount
        })
      }

      setAmount('')
      setDescription('Transfer')
      setDate(format(new Date(), 'yyyy-MM-dd'))
      setStatus('CONFIRMED')
      
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Transfer error:', error)
      alert('An error occurred while creating the transfer')
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
  }

  const swapAccounts = () => {
    const temp = fromAccountId
    setFromAccountId(toAccountId)
    setToAccountId(temp)
  }

  const availableToAccounts = accounts.filter(acc => acc.id !== fromAccountId)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-none" style={{ backgroundColor: 'var(--background)' }}>
        <DrawerHeader>
          <DrawerTitle>Transfer Money</DrawerTitle>
          <DrawerDescription>Move money between your accounts</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-8">
          
          {/* Description */}
          <div className="text-center mb-4">
            <Input value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Description" className="text-center text-lg border-0 shadow-none focus-visible:ring-0 px-0"/>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <CurrencyInput value={amount} onChange={handleAmountChange} placeholder="0.00" className="text-5xl font-bold"/>
          </div>

          {/* Account Selection */}
          <div className="mb-6 space-y-4">
            {/* From Account */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">From Account</label>
              <Select value={fromAccountId.toString()} onValueChange={(value) => setFromAccountId(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id!.toString()}>
                      {account.accountName} - {account.balance.toFixed(2)}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button type="button" variant="ghost" onClick={swapAccounts}
              className="rounded-full p-3 hover:bg-muted" disabled={!toAccountId}>
                <ArrowRightLeft className="w-5 h-5" />
              </Button>
            </div>

            {/* To Account */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">To Account</label>
              <Select value={toAccountId.toString()} onValueChange={(value) => setToAccountId(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {availableToAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id!.toString()}>
                      {account.accountName} - {account.balance.toFixed(2)}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Status */}
          <div className="grid grid-cols-2 gap-3 mb-6 opacity-50">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-sm" />
            <div>
              <Select value={status} onValueChange={(value) => setStatus(value as MovementStatus)}>
                <SelectTrigger className="text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className={`w-full h-12 ${getButtonStyle(theme)}`} 
            disabled={loading || !fromAccountId || !toAccountId || fromAccountId === toAccountId || !parseFloat(amount)}>
            {loading ? 'Processing...' : 'Transfer Money'}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
