'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { bankAccountApi, AccountType } from "@/lib/api/bank/accounts-api"
import { getButtonStyle } from "@/lib/themes"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { getCardGradient } from "@/lib/util/credit_card"
import { formatBalance } from "@/lib/util/converter"

export default function AddAccountDesktop() {
  const router = useRouter()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    accountName: '',
    iban: '',
    balance: 0,
    type: 'CURRENT' as AccountType,
    priority: 0
  })

  const accountTypes: AccountType[] = ['CURRENT', 'SAVINGS', 'INVESTMENTS', 'CLOSED']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      alert('User not authenticated')
      return
    }

    try {
      setSaving(true)
      
      const createData = {
        ...formData,
        userId: user.id
      }

      await bankAccountApi.create(createData)
      router.push('/accounts')
    } catch (error) {
      console.error('Error creating account:', error)
      alert('Failed to create account')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/accounts')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-muted/30 to-background backdrop-blur-xl border-b p-8">
        <div className="flex items-center gap-4">
          <Button onClick={handleCancel} variant="ghost" className="h-12 w-12 p-0 rounded-full hover:bg-white/20">
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Add Account</h1>
            <p className="text-lg text-muted-foreground">
              Create a new bank account
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Account Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Name */}
                <div className="space-y-2">
                  <Label htmlFor="accountName" className="text-base font-semibold">
                    Account Name
                  </Label>
                  <Input id="accountName" type="text" value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} 
                  className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm" placeholder="e.g., Main Checking" required/>
                </div>

                {/* IBAN */}
                <div className="space-y-2">
                  <Label htmlFor="iban" className="text-base font-semibold">
                    IBAN
                  </Label>
                  <Input id="iban" type="text" value={formData.iban} onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
                   className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm font-mono" placeholder="PT00 TEST TEST TEST TEST 00" required/>
                </div>

                {/* Balance */}
                <div className="space-y-2">
                  <Label htmlFor="balance" className="text-base font-semibold">
                    Initial Balance
                  </Label>
                  <Input 
                    id="balance" 
                    type="text"
                    inputMode="decimal"
                    value={formData.balance.toFixed(2)} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.-]/g, '');
                      const parsed = parseFloat(value);
                      if (!isNaN(parsed)) {
                        setFormData({ ...formData, balance: Math.round(parsed * 100) / 100 });
                      } else if (value === '' || value === '-') {
                        setFormData({ ...formData, balance: 0 });
                      }
                    }}
                    className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm" 
                    placeholder="0.00" 
                    required
                  />
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-semibold">
                    Account Type
                  </Label>
                  <select id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })} 
                  className="w-full h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4" required>
                    {accountTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-base font-semibold">
                    Priority
                  </Label>
                  <Input id="priority" type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })} 
                  className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm" placeholder="0" required/>
                  <p className="text-sm text-muted-foreground">Lower numbers appear first</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button type="button" onClick={handleCancel} className="flex-1 h-14 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-base rounded-full shadow-lg
                      hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className={`flex-1 h-14 ${getButtonStyle(theme)} font-bold text-base rounded-full shadow-lg
                      hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Create Account
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Preview</h2>
              
              {/* Account Card Preview */}
              <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl shadow-xl">
                
                {/* Card Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(formData.type)} opacity-40`}></div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

                {/* Card Content */}
                <div className="relative z-10 p-6">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs font-medium mb-1">Account</p>
                      <h3 className="text-lg font-bold">
                        {formData.accountName || 'Account Name'}
                      </h3>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-6">
                    <p className="text-sm mb-1">Current Balance</p>
                    <h2 className="text-4xl font-bold">
                      {formatBalance(formData.balance)}
                    </h2>
                  </div>

                  {/* IBAN */}
                  <div className="mb-4">
                    <p className="text-sm font-mono tracking-wider">
                      {formData.iban ? 
                        `${formData.iban.slice(0, 4)} •••• •••• •••• •• • • ${formData.iban.slice(-4)}` :
                        'XXXX •••• •••• •••• •• • • XXXX'
                      }
                    </p>
                  </div>

                  {/* Account Type Badge */}
                  <div className="flex gap-2">
                    <div className="inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                      <span className="text-xs font-semibold">
                        {formData.type}
                      </span>
                    </div>
                    <div className="inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                      <span className="text-xs font-semibold">
                        {formData.balance >= 0 ? 'Active' : 'Overdrawn'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inner glow */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none"></div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> The preview shows how your account card will appear in the accounts list.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
