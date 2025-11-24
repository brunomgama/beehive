'use client'

import { useAuth } from "@/contexts/auth-context"

import { useEffect, useState } from "react"
import { movementApi, Movement, plannedMovementApi, PlannedMovement } from "@/lib/api/bank-api"
import { HeaderDashboard } from "./header-dashboard"
import { OverviewDashboard } from "./overview-dashboard"
import { MovementsDashboardTable } from "./movements-dashboard"
import { PlannedMovementsDashboardTable } from "./planned-movements-dashboard"

export function Dashboard() {
  const { user } = useAuth()

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [plannedMovements, setPlannedMovements] = useState<PlannedMovement[]>([]);

  useEffect(() => {
    if (selectedAccountId) {
      fetchRecentMovements(selectedAccountId);
      fetchPlannedMovements(selectedAccountId);
    }
  }, [selectedAccountId]);

  const fetchRecentMovements = async (accountId: number) => {
    try {
      const result = await movementApi.getAll();
      if (result.data) {
        const accountMovements = result.data
          .filter((movement: Movement) => movement.accountId === accountId).reverse().slice(0, 5);
        setRecentMovements(accountMovements);
      }
    } catch (error) {
      console.error("Error fetching movements:", error);
    }
  };

  const fetchPlannedMovements = async (accountId: number) => {
    try {
      const result = await plannedMovementApi.getAll();
      if (result.data) {
        const accountPlannedMovements = result.data
          .filter((movement: PlannedMovement) => movement.accountId === accountId)
          .sort((a, b) => new Date(a.nextExecution).getTime() - new Date(b.nextExecution).getTime())
          .slice(0, 5);
        setPlannedMovements(accountPlannedMovements);
      }
    } catch (error) {
      console.error("Error fetching planned movements:", error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto p-4">
        
        {/* Header Section */}
        {user != null && (
          <HeaderDashboard user={user} />
        )}
        
        {/* Movements in Account */}
        <OverviewDashboard setSelectedAccountId={setSelectedAccountId} />
        
        {/* Movements Section */}
        <MovementsDashboardTable recentMovements={recentMovements} />

        {/* Planned Movements Section */}
        <PlannedMovementsDashboardTable plannedMovements={plannedMovements}/>

      </div>

      {/* <div className="fixed bottom-0 left-0 w-full bg-white h-12 shadow-md z-50 flex items-center justify-center">
        <p className="text-gray-700 text-sm">Persistent Bar</p>
      </div> */}
    </div>
  )
}