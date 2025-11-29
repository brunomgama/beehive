'use client'

import FloatingNav from "@/components/v2/ui/floating_navbar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react";
import SettingsPage from "./settings/page";
import BankOverview from "./bank/page";

export default function Home() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(2);

  const sections = [
    { 
      id: 0, 
      component: <SettingsPage />, 
    },
    { 
      id: 1, 
      component: <SettingsPage />, 
    },
    { 
      id: 2, 
      component: <SettingsPage />, 
    },
    { 
      id: 3, 
      component: <BankOverview/>, 
    },
    { 
      id: 4, 
      component: <SettingsPage />, 
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