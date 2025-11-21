import { Badge } from "@/components/ui/badge-1";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { Movement } from "@/lib/api/bank-api";
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
                  <li key={movement.id} className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                        <span className="text-lg">{movement.category[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{movement.description}</p>
                        <p className="text-xs text-gray-400">{new Date(movement.date).toLocaleDateString()}</p>
                      </div>
                      { movement.status === 'PENDING' && (
                        <div className="ml-4">
                          <Badge variant={`pending`}>
                            {movement.status}
                          </Badge>
                        </div>
                      )}
                      { movement.status === 'CANCELLED' && (
                        <div className="ml-4">
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
                    <div className={`font-bold`}>
                      {movement.type === 'INCOME' ? '+' : '-'} {movement.amount} €
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white text-sm">No recent movements.</p>
            )}
            {recentMovements.length === 5 && (
              <div className="text-center">
                <Button variant={"ghost"} onClick={() => handleRedirect('/bank/movements')} className="text-sm">
                  See All
                </Button>
              </div>
            )}
          </LiquidGlassCard>
        </div>
    )
}