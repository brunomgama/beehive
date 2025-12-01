"use client"

import { AccountProvider } from "./account_context"
import { CardsCarousel } from "./cards_carousel"
import { PlannedMovements } from "./planned_movements"
import { RecentMovements } from "./recent_movements"
import { useAuth } from "@/contexts/auth-context"

export default function AccountsMobile() {
  const { user } = useAuth()

    return (
        <AccountProvider>
            <div className="min-h-screen pb-28">
                {user && <CardsCarousel user={user} />}
                <RecentMovements/>
                <PlannedMovements/>
            </div>
        </AccountProvider>
    )
}