'use client'

import { useState, useEffect } from "react"
import { Plus, MoreVertical, Edit2, Trash2, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getCardGradient } from "@/lib/util/credit_card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { formatBalance } from "@/lib/util/converter"
import { BankAccount, bankAccountApi } from "@/lib/api/bank/accounts-api"

export default function AccountsDesktop() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    fetchAccounts()
  }, [user?.id])

  const fetchAccounts = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const result = await bankAccountApi.getByUserId(user.id)
      if (result.data) {
        const sortedAccounts = result.data.sort((a, b) => a.priority - b.priority)
        setAccounts(sortedAccounts)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (accountId: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return
    
    try {
      await bankAccountApi.delete(accountId)
      await fetchAccounts()
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account')
    }
  }

  const handleEdit = (accountId: number) => {
    console.log('Edit account:', accountId)
  }

  const handleCreate = () => {
    console.log('Create new account')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="h-10 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-3xl p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Accounts</h1>
            <p className="text-lg text-muted-foreground">
              Manage your {accounts.length} bank account{accounts.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Add Account Button */}
          <Button onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 
            hover:from-amber-500 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
            <Plus size={20} />
            Add Account
          </Button>
        </div>

        {/* Accounts Grid - 4 per row */}
        <div className="grid grid-cols-4 gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="group relative" onMouseEnter={() => setHoveredCard(account.id || null)} 
            onMouseLeave={() => setHoveredCard(null)}>
              {/* Account Card - Glass Effect */}
              <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                
                {/* Card Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(account.type)} opacity-40`}></div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

                {/* Card Content */}
                <div className="relative z-10 p-6">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-xs text-white/70 font-medium mb-1 drop-shadow">Account</p>
                      <h3 className="text-lg font-bold text-white drop-shadow-lg">
                        {account.accountName}
                      </h3>
                    </div>
                    
                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition-all flex items-center justify-center border border-white/20">
                          <MoreVertical size={16} className="text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEdit(account.id!)}>
                          <Edit2 size={16} className="mr-2" />
                          Edit Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(account.id!)} className="text-destructive focus:text-destructive">
                          <Trash2 size={16} className="mr-2" />
                          Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Balance */}
                  <div className="mb-6">
                    <p className="text-sm text-white/70 mb-1 drop-shadow">Current Balance</p>
                    <h2 className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                      {formatBalance(account.balance)}
                    </h2>
                  </div>

                  {/* IBAN */}
                  <div className="mb-4">
                    <p className="text-sm font-mono text-white/80 drop-shadow tracking-wider">
                      {account.iban.slice(0, 4)} •••• {account.iban.slice(-4)}
                    </p>
                  </div>

                  {/* Account Type Badge */}
                  <div className="inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                    <span className="text-xs font-semibold text-white drop-shadow">
                      {account.type}
                    </span>
                  </div>
                </div>

                {/* Inner glow */}
                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.1)] pointer-events-none"></div>
              </div>

              {/* Account Details Below Card - White Glass */}
              <div className="mt-4 relative rounded-2xl p-4 backdrop-blur-xl border border-white/30 bg-white/30 transition-all duration-300">
                <div className="relative z-10 space-y-3">
                  
                  {/* Priority & Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">Priority: {account.priority}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      account.balance >= 0 ? 'bg-ok/20 text-ok' : 'bg-nok/20 text-nok'
                    }`}>
                      {account.balance >= 0 ? 'Active' : 'Overdrawn'}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleEdit(account.id!)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/50 hover:bg-white/70 backdrop-blur-md text-sm font-medium 
                      text-gray-700 transition-all border border-white/30">
                      Edit
                    </button>
                    <button onClick={() => console.log('View transactions')}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/50 hover:bg-white/70 backdrop-blur-md text-sm font-medium 
                      text-gray-700 transition-all border border-white/30">
                      Transactions
                    </button>
                  </div>
                </div>

                {/* Inner glow */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(255,255,255,0.2)] pointer-events-none"></div>
              </div>
            </div>
          ))}

          {/* Add Account Card */}
          <button onClick={handleCreate} className="relative rounded-3xl p-6 backdrop-blur-xl border-2 border-dashed 
          border-white/40 bg-white/20 hover:bg-white/30 hover:border-white/60 transition-all duration-300 flex flex-col 
          items-center justify-center min-h-[320px] group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Account</h3>
            <p className="text-sm text-gray-600">Create a new bank account</p>
          </button>
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <TrendingUp size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">No Accounts Yet</h2>
            <p className="text-muted-foreground mb-6">Get started by adding your first bank account</p>
            <Button onClick={handleCreate} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 
            hover:to-orange-600 text-white font-semibold shadow-lg">
              <Plus size={20} className="mr-2" />
              Add Your First Account
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}