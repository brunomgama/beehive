import { AccountType } from '@/lib/api/types'
import { formatBalance, getCardGradient } from '@/lib/util/utils'

interface AccountPreviewCardProps {
  accountName: string
  iban: string
  balance: number
  type: AccountType
  className?: string
}

/**
 * Account Preview Card
 * Reusable component showing how account will look
 */
export function AccountPreviewCard({
  accountName,
  iban,
  balance,
  type,
  className = ''
}: AccountPreviewCardProps) {
  return (
    <div className={`relative rounded-3xl overflow-hidden backdrop-blur-2xl shadow-xl ${className}`}>
      
      {/* Card Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(type)} opacity-40`} />
      
      {/* Decorative Elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

      {/* Card Content */}
      <div className="relative z-10 p-6">
        
        {/* Card Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-medium mb-1 opacity-80">Account</p>
            <h3 className="text-lg font-bold">
              {accountName || 'Account Name'}
            </h3>
          </div>
        </div>

        {/* Balance */}
        <div className="mb-6">
          <p className="text-sm mb-1 opacity-80">Current Balance</p>
          <h2 className="text-4xl font-bold">
            {formatBalance(balance)}
          </h2>
        </div>

        {/* IBAN */}
        <div className="mb-4">
          <p className="text-sm font-mono tracking-wider opacity-80">
            {iban ? 
              `${iban.slice(0, 4)} •••• •••• •••• •• • • ${iban.slice(-4)}` :
              'XXXX •••• •••• •••• •• • • XXXX'
            }
          </p>
        </div>

        {/* Account Type Badge */}
        <div className="flex gap-2">
          <div className="inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
            <span className="text-xs font-semibold">
              {type}
            </span>
          </div>
          <div className="inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
            <span className="text-xs font-semibold">
              {balance >= 0 ? 'Active' : 'Overdrawn'}
            </span>
          </div>
        </div>
      </div>

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none" />
    </div>
  )
}