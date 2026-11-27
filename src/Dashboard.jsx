import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFullData } from './API/server_api';

const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat('en-PH');

const monthLabel = (value) => {
  if (!value) return 'Selected month';
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric',
  });
};

function StatCard({ label, value, detail, icon, accent = 'blue' }) {
  const gradients = {
    blue: 'from-blue-600 via-blue-700 to-indigo-800',
    violet: 'from-violet-600 via-purple-700 to-fuchsia-800',
    emerald: 'from-emerald-500 via-teal-600 to-cyan-800',
  };

  return (
    <section className={`group relative isolate overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[accent]} p-5 text-white shadow-lg shadow-slate-900/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/20 motion-reduce:transform-none motion-reduce:transition-none`}>
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white/80">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
          {detail && <p className="mt-1 text-xs text-white/70">{detail}</p>}
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl text-white shadow-inner ring-1 ring-white/20 backdrop-blur-sm" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-1/3 rounded-full bg-white/70 transition-all duration-500 group-hover:w-2/3" />
      </div>
    </section>
  );
}

function Panel({ title, subtitle, children, action }) {
  return (
    <section className="group/panel relative isolate min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50 to-sky-50 p-3.5 shadow-md shadow-slate-900/5 ring-1 ring-slate-200/70 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.025] hover:from-sky-200 hover:via-blue-100 hover:to-indigo-200 hover:shadow-[0_24px_55px_-18px_rgba(30,64,175,0.45)] hover:ring-2 hover:ring-blue-400/80 motion-reduce:transform-none motion-reduce:transition-none">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600 transition-transform duration-300 ease-out group-hover/panel:scale-x-100" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-blue-300/0 blur-3xl transition-colors duration-300 group-hover/panel:bg-blue-300/35" />
      <div className="relative mb-2.5 flex flex-wrap items-start justify-between gap-2 border-b border-slate-200/80 pb-2 transition-colors duration-300 group-hover/panel:border-blue-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
      {children}
    </div>
  );
}

function RankedList({ items, color = 'blue', formatValue = number.format }) {
  const entries = Object.entries(items || {}).sort((a, b) => {
    const aValue = typeof a[1] === 'number' ? a[1] : a[1]?.count || 0;
    const bValue = typeof b[1] === 'number' ? b[1] : b[1]?.count || 0;
    return bValue - aValue;
  });
  const max = Math.max(1, ...entries.map(([, value]) => typeof value === 'number' ? value : value?.count || 0));
  const barColors = {
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
  };

  if (!entries.length) return <EmptyState>No records for this month.</EmptyState>;

  return (
    <div className="space-y-1.5">
      {entries.map(([label, rawValue]) => {
        const value = typeof rawValue === 'number' ? rawValue : rawValue?.count || 0;
        const width = Math.max(3, (value / max) * 100);
        return (
          <div key={label} className="group/item -mx-1 rounded-lg bg-gradient-to-r from-slate-50 to-white px-2.5 py-1.5 shadow-sm shadow-slate-900/5 transition-all duration-300 ease-out hover:translate-x-2 hover:scale-[1.035] hover:bg-gradient-to-r hover:from-blue-300 hover:via-sky-200 hover:to-indigo-300 hover:shadow-[0_12px_28px_-10px_rgba(30,64,175,0.5)] hover:ring-1 hover:ring-blue-400/70 motion-reduce:transform-none motion-reduce:transition-none">
            <div className="mb-1 flex items-center justify-between gap-2.5 text-sm">
              <span className="min-w-0 truncate font-medium text-slate-700" title={label}>{label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-slate-900">{formatValue(value)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/90 shadow-inner transition-all duration-300 group-hover/item:bg-white/90">
              <div className={`h-full rounded-full ${barColors[color]} shadow-sm transition-[width,filter] duration-700 ease-out group-hover/item:brightness-125 group-hover/item:saturate-150`} style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardUI() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getFullData(selectedMonth);
      console.log('Dashboard data:', data);
      setStats(data || null);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('We couldn’t load the dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, refreshKey]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const safeStats = stats || {};
  const planCounts = safeStats.planCounts || {};
  const embalmerStats = safeStats.embalmerStats || {};
  const coffinStats = safeStats.coffinStats || {};
  const locationCounts = safeStats.locationCounts || {};

  const coffinRows = useMemo(
    () => Object.entries(coffinStats).sort((a, b) => (b[1]?.totalAmount || 0) - (a[1]?.totalAmount || 0)),
    [coffinStats]
  );

  const hasData = Number(safeStats.totalClients || 0) > 0 ||
    Object.keys(planCounts).length > 0 || Object.keys(embalmerStats).length > 0 ||
    Object.keys(coffinStats).length > 0 || Object.keys(locationCounts).length > 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Service overview</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Monthly service reports · {monthLabel(selectedMonth)}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Reporting month</span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-300/30 [color-scheme:dark]"
              />
            </label>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={loading}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Refreshing…' : '↻ Refresh'}
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <button onClick={() => setRefreshKey((key) => key + 1)} className="font-semibold underline underline-offset-2">Try again</button>
          </div>
        )}

        {loading && !stats ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Loading dashboard">
            {[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}
          </div>
        ) : !hasData ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="text-4xl" aria-hidden="true">📊</div>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">No service records found</h2>
            <p className="mt-1 text-sm text-slate-500">There are no dashboard records for {monthLabel(selectedMonth)}.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <StatCard label="Total clients" value={number.format(safeStats.totalClients || 0)} detail="Clients recorded this month" icon="👥" accent="blue" />
              <StatCard label="Senior citizens" value={number.format(safeStats.seniors || 0)} detail="Age 60 and above" icon="🧓" accent="violet" />
              <StatCard label="Total coffin amount" value={currency.format(safeStats.grandTotalCoffinAmount || 0)} detail="Recorded coffin value" icon="₱" accent="emerald" />
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <Panel title="Clients by plan" subtitle="Distribution of clients across service plans">
                <RankedList items={planCounts} color="violet" />
              </Panel>
              <Panel title="Clients by embalmer" subtitle="Number of clients handled by each embalmer">
                <RankedList items={embalmerStats} color="teal" />
              </Panel>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <Panel title="Coffin breakdown" subtitle="Quantity and total recorded amount by coffin type">
                {coffinRows.length === 0 ? <EmptyState>No coffins recorded for this month.</EmptyState> : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[340px] text-left text-sm">
                      <thead>
                        <tr className="text-xs uppercase tracking-wide text-slate-400">
                          <th className="pb-3 font-semibold">Coffin type</th>
                          <th className="pb-3 text-right font-semibold">Qty.</th>
                          <th className="pb-3 text-right font-semibold">Total amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {coffinRows.map(([name, data]) => (
                          <tr key={name} className="transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-blue-100 hover:via-indigo-50 hover:to-white hover:shadow-md motion-reduce:transition-none">
                            <td className="py-2 pr-3 font-medium text-slate-700">{name}</td>
                            <td className="py-2 text-right tabular-nums text-slate-600">{number.format(data?.count || 0)}</td>
                            <td className="py-2 text-right font-semibold tabular-nums text-emerald-700">{currency.format(data?.totalAmount || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
              <Panel title="Clients by location" subtitle="Where this month’s clients are from">
                <RankedList items={locationCounts} color="blue" />
              </Panel>
            </div>
          </>
        )}

        <footer className="flex flex-col gap-1 border-t border-slate-200 pt-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>Service reports dashboard</span>
          <span>Showing data for {monthLabel(selectedMonth)}</span>
        </footer>
      </div>
    </main>
  );
}
