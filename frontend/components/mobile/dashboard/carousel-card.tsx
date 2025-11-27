'use client'

import { useState, useEffect } from 'react'
import { bankAccountApi, BankAccount } from '@/lib/api/bank-api'
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel"
import { LoadingPage } from '@/components/mobile/loading/loading-page'
import { useAuth } from '@/contexts/auth-context'
import { MeshGradient } from '@paper-design/shaders-react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export function CarouselAccountCard({ onAccountChange }: { onAccountChange: (accountId: number) => void }) {
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

  useEffect(() => {
    if (accounts.length > 0 && api) {
      const selectedAccountId = accounts[current]?.id;
      if (selectedAccountId) {
        onAccountChange(selectedAccountId);
      }
    }
  }, [current, accounts, api]);

  const fetchAccounts = async () => {
    try {
      const result = await bankAccountApi.getAll();
  
      console.log('API result:', result.data);
      console.log('Current user:', user);
  
      if (result.data && user) {
        const userAccounts = result.data
          .filter(account => account.userId === user.id)
          .sort((a, b) => a.id! - b.id!)
          .sort((a, b) => a.priority! - b.priority!);
        setAccounts(userAccounts);
        console.log('User accounts filtered and sorted:', userAccounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (<LoadingPage title="Accounts listing..." loadingText="Processing • Please wait • Processing • " />)
  }

  console.log(accounts.length)

  return (
    <div className="relative space-y-4 pt-0 py-10">
      <MeshGradient
        className="w-full h-full absolute inset-0 -z-10 rounded-xl shadow-xl"
        colors={["#DBE2EF", "#3F72AF", "#DBE2EF", "#DBE2EF"]}
        speed={0.9} style={{ backgroundColor: "#112D4E", opacity:0.9}} />
        {accounts.length > 0 ? (
          <div>
            <Carousel className="w-full" setApi={setApi}>
              <CarouselContent>
                {accounts.map((account) => (

                  <CarouselItem key={account.id}>
                  <div className="relative p-4 flex flex-col justify-between min-h-[9rem]">

                    {/* Top Right Icon */}
                    <Button variant={"ghost"} className="absolute top-3 right-3 text-color">
                      <Eye/>
                    </Button>

                    {/* Main Text */}
                    <div>
                      <h4 className="text-sm text-color mb-2">{account.accountName}</h4>
                      <p className="text-4xl text-color font-bold">{formatCurrency(account.balance)}</p>
                    </div>

                    {/* Bottom Left Text */}
                    <span className="absolute bottom-0 left-4 text-xs text-color">
                      Last updated 2h ago
                    </span>

                  </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
    
            {accounts.length > 1 && (
              <div className="absolute bottom-3 w-full flex justify-center space-x-1">
                {accounts.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1 h-1 rounded-full transition-colors ${
                      index === current ? 'bg-background-dark' : 'bg-background-dark/20 bg-opacity-50'
                    }`}
                    onClick={() => api?.scrollTo(index)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
        <div className="p-4 bg-card rounded-lg border text-center">
          <h3 className="text-sm font-semibold mb-1">No Accounts</h3>
          <p className="text-xs text-muted-foreground">Create your first bank account to get started!</p>
        </div>
      )}
    </div>
  );
}