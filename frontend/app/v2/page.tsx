'use client'

import FloatingNav from "@/components/v2/ui/floating_navbar"
import SwipeableCards from "@/components/v2/ui/swipe_cards";
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react";
import SettingsPage from "./settings/page";

export default function Home() {
  const isMobile = useIsMobile()
  const [activeIndex, setActiveIndex] = useState(2);

  const sections = [
    { 
      id: 0, 
      component: <SettingsPage />, 
      backgroundColor: 'bg-blue-50' 
    },
    // { 
    //   id: 1, 
    //   component: <NotesPage />, 
    //   backgroundColor: 'bg-purple-50' 
    // },
    // { 
    //   id: 2, 
    //   component: <HomePage />, 
    //   backgroundColor: 'bg-orange-50' 
    // },
    // { 
    //   id: 3, 
    //   component: <AccountsPage />, 
    //   backgroundColor: 'bg-green-50' 
    // },
    // { 
    //   id: 4, 
    //   component: <InfoPage />, 
    //   backgroundColor: 'bg-pink-50' 
    // }
  ];

  return (
    <>
      {isMobile ? 
        <div className="h-screen w-full bg-gray-50 overflow-hidden">
          <SwipeableCards activeIndex={activeIndex} onIndexChange={setActiveIndex} sections={sections}/>
          <FloatingNav active={activeIndex} onActiveChange={setActiveIndex} />
        </div>
      :
        <div> is mobile </div>
      }
    </>
  )
}