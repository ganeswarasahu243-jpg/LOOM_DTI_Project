import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Profile</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Manage your LOOM identity.</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Account details below are loaded from your authenticated backend session.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/10">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6">
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-2 text-xl font-semibold text-white">{user?.name || 'Unavailable'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-xl font-semibold text-white">{user?.email || 'Unavailable'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6">
              <p className="text-sm text-slate-400">Role</p>
              <p className="mt-2 text-xl font-semibold capitalize text-white">{user?.role || 'Unavailable'}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button className="w-full" disabled>Profile edits coming soon</Button>
            <Button variant="secondary" className="w-full" disabled>Export report</Button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Snapshot</p>
          <p className="mt-3 text-slate-400">This session is backed by the live authenticated user record, not frontend demo content.</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Preferred OTP channel</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.preferredOtpChannel || 'email'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Inactivity timer</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.inactivityTimerDays || 60} days</p>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">MFA enabled</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {user?.mfa?.email || user?.mfa?.totp ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
