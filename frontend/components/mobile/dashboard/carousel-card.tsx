'use client'

import { useState, useEffect } from 'react'
import { bankAccountApi, BankAccount } from '@/lib/api/bank-api'
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { useAuth } from '@/contexts/auth-context'

export function CarouselAccountCard() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const fetchAccounts = async () => {
    try {
      const result = await bankAccountApi.getAll()

      console.log('API result:', result.data)
      console.log('Current user:', user)

      if (result.data && user) {
        const userAccounts = result.data.filter(account => account.userId === user.id)
        setAccounts(userAccounts)
        console.log('User accounts filtered:', userAccounts)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  if (loading) {
    return (<LoadingPage title="Accounts listing..." loadingText="Processing • Please wait • Processing • " />)
  }

  console.log(accounts.length)

  return (
      <div className="space-y-4">
        {accounts.length > 0 ? (
          <div>
            <Carousel className="w-full" setApi={setApi}>
              <CarouselContent>
                {accounts.map((account) => (
                  <CarouselItem key={account.id}>
                    <div className="p-4 flex flex-col items-center justify-center text-center min-h-[120px]">
                      <div className="mb-2">
                        <h4 className="text-sm font-normal">
                          {account.accountName}
                        </h4>
                      </div>
                      <p className="text-lg font-bold">
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            
            {accounts.length > 1 && (
              <div className="flex justify-center space-x-1">
                {accounts.map((_, index) => (
                  <button key={index} className={`w-1 h-1 rounded-full transition-colors ${index === current ? 'bg-white' : 'bg-muted-foreground/70'}`}
                    onClick={() => api?.scrollTo(index)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-card rounded-lg border text-center">
            <h3 className="text-sm font-semibold mb-1">No Accounts</h3>
            <p className="text-xs text-muted-foreground">
              Create your first bank account to get started!
            </p>
          </div>
        )}
      </div>
  )
}