import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { PlannedMovement } from "@/lib/api/bank-api";
import { useRouter } from "next/navigation";

export function PlannedMovementsDashboardTable({ plannedMovements }: { plannedMovements: PlannedMovement[] }) {
    const router = useRouter()

    const handleRedirect = (path: string) => {
        router.push(path);
    };

    return (
        <div className="mt-6">
          <LiquidGlassCard>
            {plannedMovements.length > 0 ? (
              <ul className="space-y-2">
                {plannedMovements.map((movement) => (
                  <li key={movement.id} className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg mr-3 bg-background-dark">
                        <span className="text-lg card-text">
                          {movement.category[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-md font-bold text-color">
                          {movement.description.charAt(0).toUpperCase() + movement.description.slice(1)}
                        </p>
                        <p className="text-xs text-color">
                          {new Date(movement.nextExecution).toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short"
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      {movement.type === 'INCOME' ? (
                        <p className="text-md font-bold income-text">
                        {'+'} {movement.amount} €
                      </p>
                      ) : (
                        <p className="text-md font-bold expense-text">
                          {'-'} {movement.amount} €
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-color text-sm">No recent movements.</p>
            )}
            {plannedMovements.length === 5 && (
              <div className="text-center mt-4">
                <Button variant={"ghost"} onClick={() => handleRedirect('/bank/movements')} className="text-color">
                  See All
                </Button>
              </div>
            )}
          </LiquidGlassCard>
        </div>
    )
}