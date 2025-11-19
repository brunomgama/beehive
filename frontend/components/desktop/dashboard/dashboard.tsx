'use client'

import { useAuth } from "@/contexts/auth-context"

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
      <p className="text-muted-foreground">
        Here's an overview of your financial management dashboard.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
        <p className="text-muted-foreground">
          Your data is protected with JWT-based authentication and secure password encryption.
        </p>
      </div>
      <div className="p-6 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">User Profile</h3>
        <div className="text-sm text-muted-foreground">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </div>
    </div>
  </div>
  )
}