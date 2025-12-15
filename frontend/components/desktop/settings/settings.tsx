'use client'

import { useState, useEffect } from "react"
import { 
  User, Settings, Shield, Bell, HelpCircle, LogOut, 
  Monitor, Smartphone, Tablet, Globe, Clock, Trash2, Edit2, 
  Save, X, ChevronRight, Palette, Lock, Mail, Key, Loader2
} from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { themes, getButtonStyle, getThemeColors } from "@/lib/themes"
import { format } from "date-fns"
import { sessionsApi, UserSession } from "@/lib/api/auth/sessions-api"

type SettingsSection = 'account' | 'preferences' | 'security' | 'notifications' | 'help'

export default function SettingsDesktop() {
  const { logout, user } = useAuth()
  const { setTheme, theme } = useTheme()
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
      })
    }
  }, [user])

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true)
      const result = await sessionsApi.getMySessions()
      if (result.data) {
        setSessions(result.data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    console.log('Saving profile:', editForm)
    setIsEditing(false)
  }

  const handleRevokeSession = async (sessionId: number) => {
    try {
      await sessionsApi.revokeSession(sessionId)
      setSessions(sessions.filter(s => s.id !== sessionId))
    } catch (error) {
      console.error('Error revoking session:', error)
    }
  }

  const handleRevokeAllOtherSessions = async () => {
    if (!confirm('Are you sure you want to log out from all other devices?')) return
    
    try {
      await sessionsApi.revokeAllOtherSessions()
      await fetchSessions()
    } catch (error) {
      console.error('Error revoking other sessions:', error)
    }
  }

  const themeColors = getThemeColors(theme)

  const sidebarItems = [
    { id: 'account' as const, label: 'My Account', icon: User },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'help' as const, label: 'Help & Support', icon: HelpCircle },
  ]

  const getDeviceIcon = (deviceType: string) => {
    const type = deviceType?.toLowerCase() || ''
    if (type.includes('mobile') || type.includes('phone')) {
      return <Smartphone size={20} />
    }
    if (type.includes('tablet')) {
      return <Tablet size={20} />
    }
    return <Monitor size={20} />
  }

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 shrink-0">
            <div className="rounded-2xl border bg-card p-4 shadow-sm sticky top-8">
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeSection === item.id
                        ? `${getButtonStyle(theme)}`
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Account Section */}
            {activeSection === 'account' && (
              <>
                {/* User Profile Card */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Account Information</h2>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          className={`gap-2 ${getButtonStyle(theme)}`}
                        >
                          <Save size={16} />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div 
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}
                    >
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      {isEditing ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={editForm.username}
                              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                              className="h-11"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="text-lg font-medium">{user?.firstName} {user?.lastName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Username</p>
                            <p className="text-lg font-medium">@{user?.username}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-lg font-medium">{user?.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Role</p>
                            <p className="text-lg font-medium capitalize">{user?.role?.toLowerCase()}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Active Sessions</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage your active sessions across devices. Sessions expire after 14 days of inactivity.
                      </p>
                    </div>
                    {sessions.length > 1 && (
                      <Button
                        onClick={handleRevokeAllOtherSessions}
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                      >
                        Logout Other Devices
                      </Button>
                    )}
                  </div>

                  {loadingSessions ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No active sessions found
                    </div>
                  ) : (
                    <div className="border rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Device</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Last Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((session) => (
                            <tr key={session.id} className="border-t">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    {getDeviceIcon(session.deviceType)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-foreground">
                                      {session.os} • {session.browser}
                                      {session.current && (
                                        <span 
                                          className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                          style={{ 
                                            backgroundColor: `${themeColors.primary}20`,
                                            color: themeColors.primary
                                          }}
                                        >
                                          <Globe size={12} />
                                          Current
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {session.sessionToken} • {session.ipAddress}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock size={14} />
                                  <span>{format(new Date(session.lastActiveAt), 'MMM dd, yyyy h:mm a')}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right">
                                {!session.current && (
                                  <Button
                                    onClick={() => handleRevokeSession(session.id)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 size={18} />
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <>
                {/* Theme Selection */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Theme</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose your preferred color theme for the application
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    {themes.map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value)}
                        className={`relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                          theme === themeOption.value
                            ? 'border-current scale-[1.02] shadow-lg'
                            : 'border-border hover:border-muted-foreground/50'
                        }`}
                        style={theme === themeOption.value ? { borderColor: themeColors.primary } : {}}
                      >
                        <div className={`w-16 h-16 rounded-full ${themeOption.color} shadow-lg border-4 border-background`} />
                        <span className="text-base font-semibold text-foreground">{themeOption.label}</span>
                        {theme === themeOption.value && (
                          <div 
                            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: themeColors.primary }}
                          >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display Settings */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Display</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Customize how the application looks and feels
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">Compact Mode</p>
                        <p className="text-sm text-muted-foreground">Reduce spacing and show more content</p>
                      </div>
                      <Button variant="outline" size="sm">Coming Soon</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">Currency Format</p>
                        <p className="text-sm text-muted-foreground">Choose your preferred currency display</p>
                      </div>
                      <Button variant="outline" size="sm">EUR (€)</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">Date Format</p>
                        <p className="text-sm text-muted-foreground">Choose your preferred date format</p>
                      </div>
                      <Button variant="outline" size="sm">DD/MM/YYYY</Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <>
                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Password</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Change your password to keep your account secure
                  </p>

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" className="h-11" />
                    </div>
                    <Button className={`${getButtonStyle(theme)} mt-4`}>
                      <Key size={16} className="mr-2" />
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-foreground mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add an extra layer of security to your account
                  </p>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Shield size={24} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Authenticator App</p>
                        <p className="text-sm text-muted-foreground">Use an authenticator app to generate codes</p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-destructive/50 bg-card p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-destructive mb-2">Danger Zone</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Irreversible and destructive actions
                  </p>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5">
                    <div>
                      <p className="font-medium text-foreground">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-2">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose what notifications you want to receive
                </p>

                <div className="space-y-4">
                  {[
                    { title: 'Email Notifications', description: 'Receive notifications via email' },
                    { title: 'Transaction Alerts', description: 'Get notified when transactions are made' },
                    { title: 'Weekly Summary', description: 'Receive a weekly summary of your finances' },
                    { title: 'Budget Alerts', description: 'Get notified when you exceed your budget' },
                    { title: 'Planned Transactions', description: 'Reminders for upcoming planned transactions' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Button variant="outline" size="sm">Coming Soon</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Help Section */}
            {activeSection === 'help' && (
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-2">Help & Support</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Get help with your account or report issues
                </p>

                <div className="space-y-4">
                  {[
                    { title: 'Documentation', description: 'Read the documentation to learn more', icon: HelpCircle },
                    { title: 'Contact Support', description: 'Get in touch with our support team', icon: Mail },
                    { title: 'Report a Bug', description: 'Found a bug? Let us know', icon: Settings },
                  ].map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <item.icon size={20} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    BeeHive Finance • Version 1.0.0
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
