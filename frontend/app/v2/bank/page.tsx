'use client'

import BankOverviewMobilePage from "@/components/v2/mobile/bank/bank_overview_mobile";
import { useAuth } from "@/contexts/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BankOverview() {
  const isMobile = useIsMobile()
  const { user } = useAuth()

  return (
    <div>
      {isMobile ? 
        <BankOverviewMobilePage user={user!}/>
        : 
        "Desktop Settings"
      }
    </div>
  );
}