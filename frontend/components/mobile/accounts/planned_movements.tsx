'use client'

import { useEffect, useState } from "react"
import { Calendar, Repeat, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format } from "date-fns"
import { useAccount } from "./account_context"
import { useTheme } from "@/contexts/theme-context"
import { getThemeButtonStyle } from "@/lib/themes"
import { getMovementIcon } from "@/lib/util/movement-icons"
import Image from "next/image"
import { PlannedMovement, plannedMovementApi } from "@/lib/api/bank/planned-api"
import { formatBalance } from "@/lib/util/utils"
import { useRouter } from "next/navigation"

export function PlannedMovements() {
  const { theme } = useTheme()
  const [movements, setMovements] = useState<PlannedMovement[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { activeAccountId } = useAccount()

  useEffect(() => {
    if (activeAccountId) {
      setMovements([])
      setLoading(true)
      fetchPlannedMovements()
    }
  }, [activeAccountId])

  const fetchPlannedMovements = async () => {
    if (!activeAccountId) return
    
    try {
      const result = await plannedMovementApi.getByAccountId(activeAccountId)
      if (result.data) {
        const sortedMovements = result.data
          .filter(m => m.status !== 'CANCELLED' && m.status !== 'FAILED')
          .sort((a, b) => new Date(a.nextExecution).getTime() - new Date(b.nextExecution).getTime())
          .slice(0, 3)
        setMovements(sortedMovements)
      } else {
        setMovements([])
      }
    } catch (error) {
      console.error('Error fetching planned movements:', error)
      setMovements([])
    } finally {
      setLoading(false)
    }
  }

  if (!activeAccountId) {
    return null
  }

  if (loading) {
    return (
      <div className="px-6 mt-8 mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-4">Upcoming</h3>
        <div className="bg-card rounded-3xl p-4 shadow-sm border border-border">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="h-5 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <div className="px-6 mt-8 mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-4">Upcoming</h3>
        <div className="bg-card rounded-3xl p-8 shadow-sm border border-border text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No planned movements</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 mt-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-foreground">Upcoming</h3>
        <button className={`text-sm font-medium transition-all duration-300 ${getThemeButtonStyle(theme, 'navIndicator')} bg-clip-text text-transparent`}
        onClick={() => router.push('/planned')}>
          See all
        </button>
      </div>

      <div className="bg-card rounded-3xl shadow-sm border border-border divide-y divide-border">
        {movements.map((movement) => {
          const icon = getMovementIcon(movement.description, movement.category)
          
          return (
            <div 
              key={movement.id}
              className="p-4 hover:bg-muted/50 transition-colors first:rounded-t-3xl last:rounded-b-3xl"
            >
              <div className="flex items-center gap-4">
                {icon.type === 'image' ? (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: icon.bgColor }}>
                    <Image src={icon.content} alt={movement.description} width={32} height={32} className="object-contain" />
                  </div>
                ) : icon.type === 'emoji' ? (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: icon.bgColor }}>
                    <span className="text-2xl">{icon.content}</span>
                  </div>
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${movement.type === 'INCOME' ? 'bg-ok/10' : 'bg-nok/10'}`}>
                    {movement.type === 'INCOME' ? (
                      <ArrowUpRight size={20} className="text-ok" />
                    ) : (
                      <ArrowDownRight size={20} className="text-nok" />
                    )}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {movement.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{format(new Date(movement.nextExecution), 'MMM dd, yyyy')}</span>
                    {movement.recurrence !== 'CUSTOM' && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Repeat size={12} />
                          <span>{movement.recurrence.charAt(0) + movement.recurrence.slice(1).toLowerCase()}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-base font-bold ${
                    movement.type === 'INCOME' ? 'text-ok' : 'text-foreground'
                  }`}>
                    {movement.type === 'INCOME' ? '+' : '-'}{formatBalance(Math.abs(movement.amount))}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{movement.category.toLowerCase()}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}