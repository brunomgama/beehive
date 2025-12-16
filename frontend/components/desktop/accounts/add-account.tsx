'use client'

import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/contexts/theme-context"
import { getButtonStyle } from "@/lib/themes"
import { AccountType } from "@/lib/api/types"
import { useAddAccountForm } from "@/hooks/use-add-account-form"
import { AccountPreviewCard } from "@/components/shared/account-preview-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { capitalizeFirstLetter } from "@/lib/util/utils"

/**
 * Add Account Desktop Component
 * Full-featured form with live preview
 */
export default function AddAccountDesktop() {
  const { theme } = useTheme()
  const { formData, updateField, accountTypes, saving, error, handleSubmit, handleCancel } = useAddAccountForm()

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background">
      
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-br from-muted/30 to-background backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 pt-8">
          <div className="flex items-center gap-4">
            <Button onClick={handleCancel} variant="ghost" className="h-12 w-12 p-0 rounded-full">
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground"> Add Account </h1>
              <p className="text-lg text-muted-foreground"> Create a new bank account </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Account Details</h2>
              
              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                  <AlertCircle className="text-destructive" size={20} />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Account Name */}
                <div className="space-y-2">
                  <Label htmlFor="accountName" className="text-base font-semibold">
                    Account Name *
                  </Label>
                  <Input id="accountName" type="text" value={formData.accountName} onChange={(e) => updateField('accountName', e.target.value)}
                   className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm" placeholder="e.g., Main Checking" required/>
                </div>

                {/* IBAN */}
                <div className="space-y-2">
                  <Label htmlFor="iban" className="text-base font-semibold">
                    IBAN *
                  </Label>
                  <Input id="iban" type="text" value={formData.iban} onChange={(e) => updateField('iban', e.target.value.toUpperCase())}
                   className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm font-mono" placeholder="PT00 0000 0000 0000 0000 0000 0" required/>
                  <p className="text-xs text-muted-foreground">
                    Enter your International Bank Account Number
                  </p>
                </div>

                {/* Balance */}
                <div className="space-y-2">
                  <Label htmlFor="balance" className="text-base font-semibold">
                    Initial Balance
                  </Label>
                  <Input id="balance" type="number" step="0.01" value={formData.balance} onChange={(e) => updateField('balance', parseFloat(e.target.value) || 0)}
                   className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm" placeholder="0.00"/>
                  <p className="text-xs text-muted-foreground">
                    Current balance in this account
                  </p>
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-semibold">
                    Account Type *
                  </Label>
                  <Select value={formData.type} onValueChange={(value) => updateField('type', value as AccountType)}>
                    <SelectTrigger className="w-full min-h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypes.map((type: AccountType) => (
                        <SelectItem key={type} value={type}>
                          {capitalizeFirstLetter(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-base font-semibold">
                    Display Priority
                  </Label>
                  <Input id="priority" type="number" value={formData.priority} onChange={(e) => updateField('priority', parseInt(e.target.value) || 0)}
                   className="h-12 text-base rounded-xl border-2 bg-white/50 backdrop-blur-sm" placeholder="0"/>
                  <p className="text-xs text-muted-foreground">
                    Lower numbers appear first (0 = highest priority)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button type="button" onClick={handleCancel} variant="outline" className="flex-1 h-14 font-bold text-base rounded-full">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}
                    className={`flex-1 h-14 ${getButtonStyle(theme)} font-bold text-base rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}>
                    {saving ? (
                      <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating... </>
                    ) : (
                      <> <Save className="mr-2 h-5 w-5" /> Create Account </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="rounded-3xl backdrop-blur-xl border bg-white/30 p-8 shadow-xl sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Preview</h2>
              
              {/* Account Card Preview */}
              <AccountPreviewCard accountName={formData.accountName} iban={formData.iban} balance={formData.balance} type={formData.type} />

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-foreground">
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