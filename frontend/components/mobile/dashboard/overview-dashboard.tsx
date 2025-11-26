import { CarouselAccountCard } from "./carousel-card";
import { LiquidGlassCircleButton } from "@/components/ui/liquid-glass-button";
import { ArrowRightLeft, ChartArea, Clock, Ellipsis, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OverviewDashboard({ setSelectedAccountId }: { setSelectedAccountId: (id: number | null) => void }) {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccount] = useState<number | null>(null);

  const handleRedirect = (path: string) => {
    router.push(path);
  };


  return (
    <>
      <div className="mb-6">
          <CarouselAccountCard onAccountChange={(id) => {
              setSelectedAccount(id);
              setSelectedAccountId(id);
            }} />
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4 mb-6 place-items-center">
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={
            <Plus size={20} />} onClick={() => {
              if (selectedAccountId) {
                router.push(`/bank/movements/new?accountId=${selectedAccountId}`);
              } else {
                router.push("/bank/movements/new");
              }
            }} 
          />
          <span className="text-xs text-color mt-1">Add</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={
            <ArrowRightLeft size={20} />} onClick={() => handleRedirect("/bank/movements")}
          />
          <span className="text-xs text-color mt-1">Movements</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={<ChartArea size={20} />} onClick={
            () => handleRedirect("/analytics")}
          />
          <span className="text-xs text-color mt-1">Analytics</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={<Ellipsis size={20} />} onClick={() => handleRedirect("/profile")} />
          <span className="text-xs text-color mt-1">More</span>
        </div>
      </div>

      {/* Drawer */}
      {/* <MovementDrawer
        selectedAccountId={selectedAccountId}
      /> */}
    </>
  );
}