import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User } from "@/lib/api/auth-api"
import { Settings } from "lucide-react"  

export function HeaderDashboard({ user }: { user: User }) {
    return (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar shape="rounded-corners" size="md">
              <AvatarImage src="/profile_1.png" />
            </Avatar>
            <div>
              <p className="text-sm text-color">Good morning!</p>
              <h2 className="text-lg font-bold text-color">{user?.firstName} {user?.lastName}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant={"ghost"} size={"lg"} className="text-color">
              <Settings/>
            </Button>
          </div>
        </div>
    )
}