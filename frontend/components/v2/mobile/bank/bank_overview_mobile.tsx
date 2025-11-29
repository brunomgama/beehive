"use client"

import { User } from "@/lib/v2/api/auth/auth-api"
import { CardsCarousel } from "./cards/cards_carousel"
import { AccountProvider } from "./context/account_context"
import { RecentMovements } from "./movements/recent_movements"
import { PlannedMovements } from "./planned/planned_movements"

export default function BankOverviewMobilePage({user}: {user: User}) {
    return (
        <AccountProvider>
            <div className="h-screen bg-background overflow-y-auto pb-32">
                <CardsCarousel user={user}/>
                <RecentMovements/>
                <PlannedMovements/>
            </div>
        </AccountProvider>
    )
}