"use client"

import { User } from "@/lib/v2/api/auth/auth-api"
import { CardsCarousel } from "./cards_carousel"
import { RecentMovements } from "./recent_movements"
import { PlannedMovements } from "./planned_movements"
import { AccountProvider } from "./account_context"

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