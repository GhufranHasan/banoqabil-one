'use client';

import { useEffect, useState } from 'react';
import { BellRing, Building2, FilePlus2, Save, Settings2, ShieldCheck } from 'lucide-react';
import { AppShell, type AppRole } from '@/components/app-shell';
import { PageHeader, Panel } from '@/components/dashboard-ui';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@/components/ui/native-select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';

const validRoles: AppRole[] = ['Teacher', 'Coordinator', 'Admin', 'Super Admin'];

export default function SettingsPage() {
  const [role, setRole] = useState<AppRole>('Coordinator');
  const [selectedCampus, setSelectedCampus] = useState('campus-gulshan');
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const storedRole = sessionStorage.getItem('bqone-demo-role') as AppRole | null;
    if (storedRole && validRoles.includes(storedRole)) {
      setRole(storedRole);
    }
    const storedCampus = sessionStorage.getItem('bqone-demo-campus');
    if (storedRole === 'Coordinator' || storedRole === 'Teacher') {
      setSelectedCampus('campus-isb-h8');
    } else if (storedCampus) {
      setSelectedCampus(storedCampus);
    } else {
      setSelectedCampus('all');
    }
  }, []);

  const handleCampusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCampus(val);
    sessionStorage.setItem('bqone-demo-campus', val);
    window.dispatchEvent(new CustomEvent('bqone-campus-change', { detail: val }));
  };

  const handleSave = () => {
    sessionStorage.setItem('bqone-demo-campus', selectedCampus);
    toast.add({
      title: 'Settings saved successfully',
      description: `${role} preferences and campus operational defaults updated.`,
      type: 'success',
    });
  };

  const teacher = role === 'Teacher';
  const admin = role === 'Admin' || role === 'Super Admin';

  return (
    <AppShell>
      <PageHeader
        title={admin ? 'System Settings' : teacher ? 'Teaching Settings' : 'Campus Settings'}
        description={
          admin
            ? 'Configure network-wide platform policies and defaults'
            : teacher
              ? 'Manage your teaching preferences and availability'
              : 'Configure campus operations and communication preferences'
        }
        actions={
          <>
            {admin && (
              <Button onClick={() => setAddOpen(true)} className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white">
                <FilePlus2 className="size-4 mr-2" />
                Add Setting
              </Button>
            )}
            <Button variant="outline" className="bg-white border-slate-200" onClick={handleSave}>
              <Save className="size-4 mr-2" />
              Save Changes
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={teacher ? 'Teaching Preferences' : admin ? 'Platform Defaults' : 'Campus Operations'}>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {teacher ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Primary Specialization</span>
                  <NativeSelect defaultValue="web" className="w-full">
                    <NativeSelectOption value="web">Web Development</NativeSelectOption>
                    <NativeSelectOption value="graphic">Graphic Design</NativeSelectOption>
                    <NativeSelectOption value="marketing">Digital Marketing</NativeSelectOption>
                    <NativeSelectOption value="cyber">Cyber Security</NativeSelectOption>
                  </NativeSelect>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Preferred Shift</span>
                  <NativeSelect defaultValue="morning" className="w-full">
                    <NativeSelectOption value="morning">Morning (09:00 - 11:00)</NativeSelectOption>
                    <NativeSelectOption value="evening">Evening (17:00 - 19:00)</NativeSelectOption>
                    <NativeSelectOption value="weekend">Weekend (Sat - Sun)</NativeSelectOption>
                  </NativeSelect>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Weekly Batch Capacity</span>
                  <NativeSelect defaultValue="4" className="w-full">
                    <NativeSelectOption value="3">3 batches (18 hrs/week)</NativeSelectOption>
                    <NativeSelectOption value="4">4 batches (24 hrs/week - Standard)</NativeSelectOption>
                    <NativeSelectOption value="5">5 batches (30 hrs/week - Max)</NativeSelectOption>
                  </NativeSelect>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Assigned Campus</span>
                  <NativeSelect value={selectedCampus} onChange={handleCampusChange} className="w-full">
                    <NativeSelectOptGroup label="Karachi Campuses">
                      <NativeSelectOption value="campus-gulshan">Gulshan Campus, Karachi</NativeSelectOption>
                      <NativeSelectOption value="campus-nazimabad-girls">Nazimabad Girls Campus, Karachi</NativeSelectOption>
                    </NativeSelectOptGroup>
                    <NativeSelectOptGroup label="Lahore Campuses">
                      <NativeSelectOption value="campus-lahore-township">Lahore Township Campus</NativeSelectOption>
                      <NativeSelectOption value="campus-iqbal-lahore">Iqbal Campus, Lahore</NativeSelectOption>
                    </NativeSelectOptGroup>
                    <NativeSelectOptGroup label="Islamabad Campuses">
                      <NativeSelectOption value="campus-isb-i8">I-8 Campus (Jamia Masjid Al Furqan)</NativeSelectOption>
                      <NativeSelectOption value="campus-isb-h8">H-8 Campus (Jamia Tafheem-ul-Quran)</NativeSelectOption>
                      <NativeSelectOption value="campus-isb-g12">G-12 Campus (Lahore Leads Univ)</NativeSelectOption>
                      <NativeSelectOption value="campus-isb-kyani">Kyani Road Campus (Bharakhu)</NativeSelectOption>
                      <NativeSelectOption value="campus-isb-cbr">CBR Town Campus, Islamabad</NativeSelectOption>
                      <NativeSelectOption value="campus-isb-kahuta">Kahuta Road Campus (Alkhidmat IT)</NativeSelectOption>
                      <NativeSelectOption value="campus-isb-burma">Burma Town Campus, Islamabad</NativeSelectOption>
                    </NativeSelectOptGroup>
                    <NativeSelectOptGroup label="Rawalpindi Campuses & Hubs">
                      <NativeSelectOption value="campus-rwp-rcc">Rawalpindi College of Commerce (Hub)</NativeSelectOption>
                      <NativeSelectOption value="campus-rwp-satellite">Govt College Satellite Town, RWP</NativeSelectOption>
                    </NativeSelectOptGroup>
                  </NativeSelect>
                </label>
              </>
            ) : admin ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Default Attendance Eligibility</span>
                  <Input defaultValue="80%" className="w-full" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Security Fee Amount</span>
                  <Input defaultValue="PKR 3,000" className="w-full" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Default Academic Session</span>
                  <NativeSelect defaultValue="spring2026" className="w-full">
                    <NativeSelectOption value="spring2026">2026 Spring (Current Active)</NativeSelectOption>
                    <NativeSelectOption value="fall2026">2026 Fall (Upcoming)</NativeSelectOption>
                  </NativeSelect>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Audit Trail Retention</span>
                  <NativeSelect defaultValue="7y" className="w-full">
                    <NativeSelectOption value="7y">7 years (PRD Compliance)</NativeSelectOption>
                    <NativeSelectOption value="5y">5 years</NativeSelectOption>
                    <NativeSelectOption value="10y">10 years</NativeSelectOption>
                  </NativeSelect>
                </label>
              </>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Assigned Campus</span>
                  <div className="flex h-11 items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 text-xs font-semibold text-emerald-900">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      H-8 Campus, Islamabad
                    </span>
                    <span className="rounded bg-emerald-200/80 px-2 py-0.5 text-[9px] font-bold text-emerald-800 uppercase tracking-wider">
                      Locked by Admin
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-500">
                    Your account is assigned to H-8 Campus, Islamabad under RBAC policy. Coordinators cannot alter their campus jurisdiction.
                  </p>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Default Intake Capacity</span>
                  <Input type="number" defaultValue="1200" className="w-full" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Attendance Minimum Threshold</span>
                  <Input defaultValue="80%" className="w-full" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-700">Follow-up Resolution SLA</span>
                  <NativeSelect defaultValue="24" className="w-full">
                    <NativeSelectOption value="24">24 hours (Urgent)</NativeSelectOption>
                    <NativeSelectOption value="48">48 hours (Standard)</NativeSelectOption>
                    <NativeSelectOption value="72">72 hours (Relaxed)</NativeSelectOption>
                  </NativeSelect>
                </label>
              </>
            )}
          </div>
        </Panel>

        <Panel title="Notifications & Workflow">
          <div className="space-y-4 p-6">
            {[
              { label: teacher ? 'Class schedule reminders' : 'High-priority alerts (R1-R3 risks)', icon: BellRing },
              { label: teacher ? 'Attendance submission reminders' : 'Daily operations & recovery summary', icon: Settings2 },
              { label: admin ? 'Governance & transfer approval alerts' : 'Student follow-up SLA notifications', icon: ShieldCheck },
              { label: teacher ? 'Batch room & schedule change alerts' : 'Campus capacity threshold warnings', icon: Building2 },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="flex items-center gap-3 text-sm font-medium text-[#17345f]">
                  <Icon className="size-4 text-emerald-600" />
                  {label}
                </span>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add System Setting</DialogTitle>
            <DialogDescription>Create a network-wide setting. This capability is restricted to Admin.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setAddOpen(false);
              toast.add({
                title: 'Setting created',
                description: 'The new system setting was added.',
                type: 'success',
              });
            }}
          >
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">Setting Name</span>
                <Input required placeholder="e.g. Refund eligibility window" className="w-full" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">Category</span>
                <NativeSelect defaultValue="Governance" className="w-full">
                  <NativeSelectOption value="Governance">Governance</NativeSelectOption>
                  <NativeSelectOption value="Admissions">Admissions</NativeSelectOption>
                  <NativeSelectOption value="Finance">Finance</NativeSelectOption>
                </NativeSelect>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold">Value</span>
                <Input required placeholder="Enter setting value" className="w-full" />
              </label>
            </div>
            <DialogFooter className="mt-5">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-[#08aa87] to-[#083b85] text-white">
                Add Setting
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
