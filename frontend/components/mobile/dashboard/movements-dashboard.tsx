import { Badge } from "@/components/ui/badge-1";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Movement } from "@/lib/api/bank-api";
import { MovementIcon } from "@/components/ui/movement-icon";
import { useRouter } from "next/navigation";

export function MovementsDashboardTable({ recentMovements }: { recentMovements: Movement[] }) {    
    const router = useRouter()

    const handleRedirect = (path: string) => {
        router.push(path);
      };
    
    return (
        <div>
          <LiquidGlassCard>
            {recentMovements.length > 0 ? (
              <ul className="space-y-2">
                {recentMovements.map((movement) => (
                  <li key={movement.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center flex-1 min-w-0">
                      <MovementIcon description={movement.description} category={movement.category} size="md" className="mr-3"/>
                      <div className="min-w-0 mr-4">
                        <p className="text-md font-bold text-color truncate whitespace-nowrap">
                          {movement.description.charAt(0).toUpperCase() + movement.description.slice(1)}
                        </p>
                        <p className="text-xs text-color">
                          {new Date(movement.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short"})}
                        </p>
                      </div>
                      { movement.status === 'PENDING' && (
                        <div className="ml-4 shrink-0">
                          <Badge variant={`pending`}>
                            {movement.status}
                          </Badge>
                        </div>
                      )}
                      { movement.status === 'CANCELLED' && (
                        <div className="ml-4 shrink-0">
                          <Badge variant={`cancelled`}>
                            {movement.status}
                          </Badge>
                        </div>
                      )}
                      { movement.status === 'FAILED' && (
                        <div className="ml-4">
                          <Badge variant={`failed`}>
                            {movement.status}
                          </Badge>
                        </div>
                      )}
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
            {recentMovements.length === 5 && (
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