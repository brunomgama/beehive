'use client'

import FloatingNav from "@/components/v2/ui/floating_navbar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react";
import { SettingsPage } from "./settings/page";
import { BankOverview } from "./bank/page";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(2);
  const { user } = useAuth()

  const sections = [
    { 
      id: 0, 
      component: <SettingsPage mobileView={isMobile}/>, 
    },
    { 
      id: 1, 
      component: <SettingsPage mobileView={isMobile}/>, 
    },
    { 
      id: 2, 
      component: <SettingsPage mobileView={isMobile}/>, 
    },
    { 
      id: 3, 
      component: <BankOverview/>, 
    },
    { 
      id: 4, 
      component: <SettingsPage mobileView={isMobile}/>, 
    }
  ];

  return (
    <>
      {isMobile ? 
        <div className="h-screen w-full bg-background overflow-hidden">
          <div className="h-full w-full">
            {sections[activeIndex].component}
          </div>
          <FloatingNav active={activeIndex} onActiveChange={setActiveIndex} />
        </div>
      :
        <div> is mobile </div>
      }
    </>
  )
}