'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, LoaderCircle, MailPlus, Search, ShieldCheck, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ProjectSelector from '@/app/components/common/ProjectSelector';
import { useProject } from '@/app/context/ProjectContext';
import { useGetMeQuery } from '@/app/redux/api/TrainingApiSlice';
import { useListAllProjectsQuery } from '@/app/redux/api/ProjectsApiSlice';
import { useGetOrganizationMembersQuery, useInviteOrganizationMemberMutation } from '@/app/redux/api/AccessApiSlice';

const roles = ['OWNER', 'ADMIN', 'MANAGER', 'MEMBER'];

export default function AccessManagement() {
  const { selectedProjectId } = useProject();
  const me = useGetMeQuery();
  const organization = me.data?.organizations?.[0];
  const members = useGetOrganizationMembersQuery(organization?.id, { skip: !organization?.id });
  const projects = useListAllProjectsQuery();
  const [inviteMember, inviteState] = useInviteOrganizationMemberMutation();
  const [query, setQuery] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [inviteResult, setInviteResult] = useState(null);

  const currentProject = (projects.data || []).find((project) => project.id === selectedProjectId);
  const visibleMembers = useMemo(() => (members.data || []).filter((member) =>
    `${member.name || ''} ${member.email || ''} ${member.role || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [members.data, query]);
  const rolesInUse = new Set((members.data || []).map((member) => member.role)).size;

  const submitInvite = async (event) => {
    event.preventDefault();
    try {
      const result = await inviteMember({ organizationId: organization.id, email: email.trim(), role }).unwrap();
      setInviteResult(result);
      toast.success(`Invitation created for ${result.email}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Could not create invitation.');
    }
  };

  const closeInvite = () => {
    if (inviteState.isLoading) return;
    setInviteOpen(false); setEmail(''); setRole('MEMBER'); setInviteResult(null);
  };

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteResult.token);
    toast.success('Invitation token copied');
  };

  if (me.isLoading) return <div className="grid min-h-[50vh] place-items-center"><LoaderCircle className="animate-spin text-navy/35" /></div>;
  if (!organization) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">Create or join an organization before managing access.</div>;

  return <div className="mx-auto max-w-[1440px] space-y-6">
    <section className="flex flex-col gap-4 rounded-2xl border border-navy/8 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-navy/35">Project context</p><h2 className="mt-1 font-bold text-navy">{currentProject?.name || 'Choose a project'}</h2><p className="mt-1 text-xs text-navy/45">Select once and the project stays active across your workspace.</p></div>
      <div className="rounded-xl border border-navy/10 bg-offwhite px-2 py-1"><ProjectSelector /></div>
    </section>

    <section className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-xl shadow-navy/10 sm:p-8">
      <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-2xl"><div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.18em] text-white/50"><Users size={15}/> Identity and permissions</div><h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">People &amp; access</h1><p className="mt-3 text-white/60">Invite teammates and review organization access in one place.</p></div><button onClick={() => setInviteOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-navy"><MailPlus size={16}/>Invite member</button></div>
    </section>

    <div className="grid gap-4 sm:grid-cols-3">
      {[['Active members', members.data?.length ?? 0], ['Invites created', inviteResult ? 1 : 0], ['Roles in use', rolesInUse]].map(([label, value]) => <div key={label} className="rounded-xl border border-navy/8 bg-white p-5 shadow-sm"><p className="text-xs font-semibold text-navy/40">{label}</p><p className="mt-2 text-3xl font-bold text-navy">{members.isLoading ? '—' : value}</p><p className="mt-2 text-[11px] text-emerald-600">Live organization data</p></div>)}
    </div>

    <section className="overflow-hidden rounded-xl border border-navy/8 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-navy/6 p-4 sm:flex-row sm:items-center"><div><h2 className="font-bold text-navy">Organization members</h2><p className="text-xs text-navy/40">{organization.name}{currentProject ? ` · viewing ${currentProject.name}` : ''}</p></div><label className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members..." className="rounded-md border border-navy/10 py-2 pl-9 pr-3 text-sm outline-none focus:border-navy/30"/></label></div>
      {members.isError ? <div className="p-10 text-center text-sm text-red-600">{members.error?.data?.message || 'Members could not be loaded.'}</div> : members.isLoading ? <div className="grid place-items-center p-12"><LoaderCircle className="animate-spin text-navy/30"/></div> : visibleMembers.length ? <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-offwhite text-[11px] uppercase tracking-wider text-navy/40"><th className="px-5 py-3">Member</th><th className="px-5 py-3">Organization role</th><th className="px-5 py-3">Project context</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{visibleMembers.map((member) => <tr key={member.id} className="border-t border-navy/5"><td className="px-5 py-4"><p className="text-sm font-bold text-navy">{member.name || member.email}</p><p className="mt-1 text-xs text-navy/40">{member.email}</p></td><td className="px-5 py-4"><span className="badge">{member.role}</span></td><td className="px-5 py-4 text-sm text-navy/55">{currentProject?.name || 'All projects'}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600"><Check size={13}/>Active</span></td></tr>)}</tbody></table></div> : <div className="p-14 text-center"><Users className="mx-auto text-navy/20"/><p className="mt-3 font-semibold text-navy">No matching members</p></div>}
    </section>

    {inviteOpen && <div className="fixed inset-0 z-[1000] grid place-items-center bg-navy/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && closeInvite()}><form onSubmit={submitInvite} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex justify-between"><div><h2 className="text-xl font-bold text-navy">Invite member</h2><p className="mt-1 text-sm text-navy/40">Invite someone to {organization.name}.</p></div><button type="button" onClick={closeInvite} className="p-2 text-navy/40"><X size={18}/></button></div>{inviteResult ? <div className="mt-6"><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-2 font-bold text-emerald-800"><ShieldCheck size={18}/>Invitation ready</div><p className="mt-2 text-sm text-emerald-800/75">Share this one-time token securely with {inviteResult.email}. It expires {new Date(inviteResult.expiresAt).toLocaleString()}.</p><code className="mt-4 block break-all rounded-lg bg-white p-3 text-xs text-navy">{inviteResult.token}</code></div><button type="button" onClick={copyInvite} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"><Copy size={15}/>Copy invitation token</button></div> : <><label className="mt-6 block text-xs font-bold text-navy/60">Email<input autoFocus required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-field mt-2 w-full px-4 py-3" placeholder="teammate@example.com"/></label><label className="mt-4 block text-xs font-bold text-navy/60">Organization role<select value={role} onChange={(event) => setRole(event.target.value)} className="input-field mt-2 w-full px-4 py-3">{roles.map((item) => <option key={item}>{item}</option>)}</select></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={closeInvite} className="rounded-md border border-navy/10 px-4 py-2 text-sm font-semibold">Cancel</button><button disabled={inviteState.isLoading} className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{inviteState.isLoading && <LoaderCircle size={14} className="animate-spin"/>}Send invitation</button></div></>}</form></div>}
  </div>;
}
