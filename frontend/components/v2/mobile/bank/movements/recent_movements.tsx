'use client'

import { useEffect, useState } from "react"
import { Movement, movementApi } from "@/lib/v2/api/banks/movements-api"
import { MoreHorizontal } from "lucide-react"
import { formatBalance } from "@/lib/v2/util/converter"
import { format } from "date-fns"
import { useAccount } from "../context/account_context"
import { MovementIcon } from "@/lib/v2/util/movement_icons"

export function RecentMovements() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const { activeAccountId } = useAccount()

  useEffect(() => {
    if (activeAccountId) {
      fetchMovements()
    }
  }, [activeAccountId, refreshKey])

  const fetchMovements = async () => {
    if (!activeAccountId) return
    
    try {
      setLoading(true)
      const result = await movementApi.getByAccountId(activeAccountId)
      if (result.data) {

        console.log(result.data)

        const sortedMovements = result.data
          .sort((a, b) => {
            const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime()
            if (dateComparison === 0) {
              return (b.id || 0) - (a.id || 0)
            }
            return dateComparison
          })
          .slice(0, 5)
        setMovements(sortedMovements)
      }
    } catch (error) {
      console.error('Error fetching movements:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (window as any).refreshRecentMovements = () => {
      console.log('🔄 Manually refreshing movements...')
      setRefreshKey(prev => prev + 1)
    }
    
    return () => {
      delete (window as any).refreshRecentMovements
    }
  }, [])

  if (!activeAccountId) {
    return null
  }

  if (loading) {
    return (
      <div className="px-6 mt-5">
        <h3 className="text-base font-semibold text-foreground mb-3">Movements</h3>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-xl p-3 border border-border animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-2 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-muted rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <div className="px-6 mt-5">
        <h3 className="text-base font-semibold text-foreground mb-3">Movements</h3>
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
            <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">No transactions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 mt-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-foreground">Movements</h3>
        <button className="text-xs font-medium text-orange hover:text-orange-600 transition-colors">
          See All
        </button>
      </div>
      <div className="space-y-2">
        {movements.map((movement) => (
          <div key={movement.id}
            className="hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2">
              <MovementIcon description={movement.description} category={movement.category}/>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {movement.description}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {format(new Date(movement.date), 'MMM dd')}
                </p>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <p className={`text-xs font-bold ${
                  movement.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movement.type === 'INCOME' ? '+' : '-'}{formatBalance(Math.abs(movement.amount))}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}