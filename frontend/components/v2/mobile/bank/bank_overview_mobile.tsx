"use client"

import { User } from "@/lib/v2/api/auth/auth-api"
import { CardsCarousel } from "./cards_carousel"

export default function BankOverviewMobilePage({user}: {user: User}) {
    return (
        <CardsCarousel user={user}/>
    )
}