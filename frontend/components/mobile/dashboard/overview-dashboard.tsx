import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { CarouselAccountCard } from "./carousel-card";
import { LiquidGlassCircleButton } from "@/components/ui/liquid-glass-button";
import { ArrowRightLeft, Clock, Ellipsis, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MovementDrawer } from "../movements/movement-drawer";

export function OverviewDashboard({ setSelectedAccountId }: { setSelectedAccountId: (id: number | null) => void }) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAccountId, setSelectedAccount] = useState<number | null>(null);

  const handleRedirect = (path: string) => {
    router.push(path);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <div className="space-y-4 mb-6">
        <LiquidGlassCard>
          <CarouselAccountCard
            onAccountChange={(id) => {
              setSelectedAccount(id);
              setSelectedAccountId(id);
            }}
          />
        </LiquidGlassCard>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4 mb-6 place-items-center">
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={<Plus size={20} />} onClick={toggleDrawer} />
          <span className="text-xs text-white mt-1">Add</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={<ArrowRightLeft size={20} />} onClick={() => handleRedirect("/settings")} />
          <span className="text-xs text-white mt-1">Movements</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={<Clock size={20} />} onClick={() => handleRedirect("/messages")} />
          <span className="text-xs text-white mt-1">Planned</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <LiquidGlassCircleButton size={48} icon={<Ellipsis size={20} />} onClick={() => handleRedirect("/profile")} />
          <span className="text-xs text-white mt-1">More</span>
        </div>
      </div>

      {/* Drawer */}
      <MovementDrawer
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        selectedAccountId={selectedAccountId}
      />
    </>
  );
}