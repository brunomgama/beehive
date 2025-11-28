import BankOverviewMobilePage from "@/components/v2/mobile/bank/bank_overview_mobile";
import { User } from "@/lib/v2/api/auth/auth-api";

export function BankOverview({ mobileView, user }: { mobileView: boolean, user: User }) {
  return (
    <div>
      {mobileView ? 
        <BankOverviewMobilePage user={user}/>
        : 
        "Desktop Settings"
      }
    </div>
  );
}