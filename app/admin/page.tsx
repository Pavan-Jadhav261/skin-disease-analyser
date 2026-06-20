import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ActivitySquare, ShieldCheck, Users, Sparkles, Clock3 } from 'lucide-react'

import { getAuthSession } from '@/lib/auth'
import { getAllUsersReport } from '@/lib/local-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function formatDate(value: string | null) {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default async function AdminPage() {
  const session = await getAuthSession()

  if (!session || session.username !== 'admin') {
    redirect('/detect')
  }

  const report = await getAllUsersReport()

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <Sparkles className="h-4 w-4" />
              Admin dashboard
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">User Activity Overview</h1>
            <p className="max-w-2xl text-slate-300">
              Review registered users, login frequency, analysis activity, and recent events in one structured view.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-white/10 bg-white/5 p-5 text-white">
              <Users className="h-5 w-5 text-emerald-300" />
              <p className="mt-4 text-3xl font-bold">{report.totals.users}</p>
              <p className="text-sm text-slate-300">Users</p>
            </Card>
            <Card className="border-white/10 bg-white/5 p-5 text-white">
              <ActivitySquare className="h-5 w-5 text-sky-300" />
              <p className="mt-4 text-3xl font-bold">{report.totals.analyses}</p>
              <p className="text-sm text-slate-300">Analyses</p>
            </Card>
            <Card className="border-white/10 bg-white/5 p-5 text-white">
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              <p className="mt-4 text-3xl font-bold">{report.totals.logins}</p>
              <p className="text-sm text-slate-300">Logins</p>
            </Card>
            <Card className="border-white/10 bg-white/5 p-5 text-white">
              <Clock3 className="h-5 w-5 text-violet-300" />
              <p className="mt-4 text-3xl font-bold">{report.totals.registrations}</p>
              <p className="text-sm text-slate-300">Registrations</p>
            </Card>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card className="border-slate-200 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Users</h2>
              <p className="text-sm text-slate-500">Registered accounts plus the built-in admin demo user.</p>
            </div>
            <Link href="/detect">
              <Button variant="outline" className="border-slate-300 bg-transparent">
                Back to workspace
              </Button>
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-sm text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Logins</th>
                  <th className="px-4 py-3 font-medium">Analyses</th>
                  <th className="px-4 py-3 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {report.users.map((user) => (
                  <tr key={user.username} className="text-sm">
                    <td className="px-4 py-3 font-medium text-slate-950">{user.username}</td>
                    <td className="px-4 py-3">
                      <Badge className={user.role === 'admin' ? 'bg-slate-950 text-white' : 'bg-emerald-100 text-emerald-900'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-600">{user.loginCount}</td>
                    <td className="px-4 py-3 text-slate-600">{user.analysisCount}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(user.lastActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-200 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-950">Recent Activity</h2>
          <p className="mb-5 text-sm text-slate-500">Latest system events in chronological order.</p>

          <div className="space-y-3">
            {report.activities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No activity has been recorded yet.
              </div>
            ) : (
              report.activities.map((activity) => (
                <div key={activity.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{activity.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{activity.summary}</p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                      {activity.kind}
                    </Badge>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    {activity.username} - {formatDate(activity.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}

