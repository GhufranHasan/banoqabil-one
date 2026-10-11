'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Armchair,
  ArrowDownToLine,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  GraduationCap,
  RefreshCw,
  TicketCheck,
  UsersRound,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { AppShell, PageSearch } from '@/components/app-shell';
import { PageHeader, Panel, StatCard } from '@/components/dashboard-ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/toast';

const chartConfig = {
  capacity: { label: 'Total Capacity', color: '#1768eb' },
  occupied: { label: 'Occupied', color: '#08a879' },
  available: { label: 'Available', color: '#f59e0b' },
} satisfies ChartConfig;

export default function SeatAvailabilityPage() {
  const [matrix, setMatrix] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalCapacity: 1200,
    totalOccupied: 980,
    totalAvailable: 220,
    avgFillRatePct: 82,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  async function loadAvailability() {
    setLoading(true);
    try {
      const res = await fetch('/api/availability');
      const data = (await res.json()) as any;
      if (data.success) {
        setMatrix(data.matrix);
        setSummary(data.summary);
      }
    } catch {
      toast.add({ title: 'Error', description: 'Failed to load seat availability', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  const filtered = useMemo(
    () =>
      matrix.filter((row) =>
        `${row.campusName} ${row.courseName} ${row.genderPolicy}`.toLowerCase().includes(search.toLowerCase())
      ),
    [matrix, search]
  );

  const chartData = useMemo(() => {
    const campusMap: Record<string, { campus: string; capacity: number; occupied: number; available: number }> = {};
    matrix.forEach((m) => {
      const shortName = m.campusName.split(' ')[0];
      if (!campusMap[shortName]) {
        campusMap[shortName] = { campus: shortName, capacity: 0, occupied: 0, available: 0 };
      }
      campusMap[shortName].capacity += m.totalCapacity;
      campusMap[shortName].occupied += m.occupiedSeats;
      campusMap[shortName].available += m.availableSeats;
    });
    return Object.values(campusMap);
  }, [matrix]);

  return (
    <AppShell>
      <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400">
        <span>Capacity</span>
        <ArrowRight className="size-3" />
        <span>Live Seat Availability Matrix</span>
      </div>

      <PageHeader
        title="Network Seat Availability"
        description="Real-time capacity tracking across all 220 campuses, sliced by course, shift, and gender policy."
        actions={
          <Button variant="outline" className="bg-white" onClick={loadAvailability} disabled={loading}>
            <RefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh Availability
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Network Capacity" value={String(summary.totalCapacity)} change="Active Session BQ 5.0" icon={Building2} tone="blue" />
        <StatCard label="Enrolled Students" value={String(summary.totalOccupied)} change={`${summary.avgFillRatePct}% Average Fill`} icon={UsersRound} tone="green" />
        <StatCard label="Available Seats" value={String(summary.totalAvailable)} change="Open for placement" icon={Armchair} tone="amber" />
        <StatCard label="Campuses Tracked" value={`${chartData.length} Campus${chartData.length === 1 ? '' : 'es'}`} change={chartData.map((c) => c.campus).join(', ') || 'Scoped view'} icon={TicketCheck} tone="violet" />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="space-y-4">
          <Panel
            title="Course & Campus Seat Matrix"
            subtitle="Live calculated capacity minus active enrolled students"
            action={<PageSearch value={search} onChange={setSearch} placeholder="Search campus or course..." />}
          >
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="px-4 text-[9px]">Campus</TableHead>
                    <TableHead className="text-[9px]">Course</TableHead>
                    <TableHead className="text-[9px]">Gender Policy</TableHead>
                    <TableHead className="text-[9px]">Capacity</TableHead>
                    <TableHead className="text-[9px]">Occupied</TableHead>
                    <TableHead className="text-[9px]">Available</TableHead>
                    <TableHead className="text-[9px]">Fill Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row: any) => (
                    <TableRow key={row.offeringId} className="hover:bg-slate-50 transition">
                      <TableCell className="px-4 py-2 font-medium text-[10px] text-[#17345f]">
                        {row.campusName}
                      </TableCell>
                      <TableCell className="py-2 text-[10px] text-slate-700">{row.courseName}</TableCell>
                      <TableCell className="py-2">
                        <Badge
                          className={
                            row.genderPolicy === 'FEMALE_ONLY'
                              ? 'bg-pink-50 text-pink-700 text-[9px]'
                              : row.genderPolicy === 'MALE_ONLY'
                              ? 'bg-blue-50 text-blue-700 text-[9px]'
                              : 'bg-emerald-50 text-emerald-700 text-[9px]'
                          }
                        >
                          {row.genderPolicy}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 font-mono text-[10px] text-slate-700">{row.totalCapacity}</TableCell>
                      <TableCell className="py-2 font-mono text-[10px] text-slate-700">{row.occupiedSeats}</TableCell>
                      <TableCell className="py-2">
                        <span className="font-bold text-[10px] text-emerald-600 font-mono">
                          {row.availableSeats} Seats
                        </span>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-semibold text-slate-600">{row.fillRatePct}%</span>
                          <div className="h-1.5 w-14 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.min(100, row.fillRatePct)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel title="Campus Capacity Distribution">
            <div className="p-4">
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-56 w-full">
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="campus" tickLine={false} tickMargin={8} />
                    <YAxis tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="capacity" fill="var(--color-capacity)" radius={4} />
                    <Bar dataKey="occupied" fill="var(--color-occupied)" radius={4} />
                    <Bar dataKey="available" fill="var(--color-available)" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-xs text-slate-400">Loading chart...</p>
              )}
            </div>
          </Panel>

          <Panel title="Operational Value">
            <div className="p-3 text-[10px] leading-relaxed text-slate-600">
              <p className="font-semibold text-[#07558a]">⚡ Unifying Fragmented Portals</p>
              <p className="mt-1">
                Previously, Karachi, Lahore, and Islamabad operated disconnected portal silos. BanoQabil One unifies seat queries so cross-campus placements and transfers can be decided in seconds.
              </p>
            </div>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
