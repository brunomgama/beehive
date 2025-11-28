'use client'

import { BankAccount } from "@/lib/api/bank-api";
import { User } from "@/lib/v2/api/auth/auth-api";
import { bankAccountApi } from "@/lib/v2/api/banks/accounts-api";
import { useEffect, useState } from "react";

export function CardsCarousel({user}: {user: User}) {
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserAccounts()
    }, [])

    const fetchUserAccounts = async () => {
        try {
            const result = await bankAccountApi.getByUserId(user.id)
            if(result.data) {
                setAccounts(result.data)
            }
            console.log(result)
        }
        catch (error) {
            console.error('Error fetching accounts:', error);
          } finally {
            setLoading(false);
          }
    }
    
    return (
        <div></div>
    );
}