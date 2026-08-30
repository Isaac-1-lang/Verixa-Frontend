'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Copy, ExternalLink, LoaderCircle, Mail, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { TRAINING_ROLES } from '@/app/config/trainingSections';
import { useInviteOrganizationMemberMutation } from '@/app/redux/api/AccessApiSlice';
import { useCreateTrainingRecordMutation } from '@/app/redux/api/TrainingApiSlice';

export default function TrainingInviteModal({ organization, onClose }) {
  const [form, setForm] = useState({ name:'', email:'', trainingRole:'PARTICIPANT', group:'' });
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState('');
  const [inviteMember, inviteState] = useInviteOrganizationMemberMutation();
  const [createParticipant, participantState] = useCreateTrainingRecordMutation();
  const selectedRole = TRAINING_ROLES.find(role => role.value === form.trainingRole);
  const saving = inviteState.isLoading || participantState.isLoading;

  const invitationUrl = useMemo(() => {
    if (!result || typeof window === 'undefined') return '';
    const url = new URL('/auth/signup', window.location.origin);
    url.searchParams.set('mode', 'JOIN');
    url.searchParams.set('email', result.email);
    url.searchParams.set('invitationToken', result.token);
    url.searchParams.set('trainingRole', form.trainingRole);
    return url.toString();
  }, [result, form.trainingRole]);

  const update = (key, value) => setForm(previous => ({ ...previous, [key]:value }));
  const submit = async (event) => {
    event.preventDefault(); setFormError('');
    try {
      const invitation = await inviteMember({ organizationId:organization.id, email:form.email.trim(), role:'MEMBER' }).unwrap();
      try {
        await createParticipant({
          section:'participants', organizationId:organization.id, type:'PARTICIPANT',
          title:form.name.trim() || form.email.trim(), status:'INVITED',
          data:{ email:form.email.trim(), trainingRole:form.trainingRole, jobRole:'', phone:'', group:form.group.trim(), invitationId:invitation.id, invitedAt:new Date().toISOString(), expiresAt:invitation.expiresAt },
        }).unwrap();
      } catch {
        toast.error('The organization invite was created, but the training roster could not be updated.');
      }
      setResult(invitation);
      toast.success('Training invitation created');
    } catch (error) { setFormError(error?.data?.message || 'Could not create the invitation.'); }
  };

  const copyLink = async () => { await navigator.clipboard.writeText(invitationUrl); toast.success('Invitation link copied'); };
  const openGmail = () => {
    const subject = `Invitation to join ${organization.name} training`;
    const body = `Hello ${form.name || ''},\n\nYou have been invited to Verixa as ${selectedRole?.label}.\n\nAccept your invitation: ${invitationUrl}\n\nThis secure invitation expires ${new Date(result.expiresAt).toLocaleString()}.`;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(result.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
  };

  return <div className="fixed inset-0 z-[1100] grid place-items-center bg-navy/45 p-4 backdrop-blur-sm" onMouseDown={event => event.target === event.currentTarget && !saving && onClose()}>
    <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-navy/8 p-5"><div><h2 className="text-xl font-bold text-navy">Invite to training</h2><p className="mt-1 text-sm text-navy/40">Add a trainer, learner, facilitator, or mentor.</p></div><button onClick={onClose} disabled={saving} className="rounded-lg p-2 text-navy/35 hover:bg-navy/5"><X size={18}/></button></div>
      {result ? <div className="space-y-5 p-5"><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-2 font-bold text-emerald-800"><CheckCircle2 size={18}/>Invitation ready</div><p className="mt-2 text-sm text-emerald-800/70">{result.email} was added to the training roster as {selectedRole?.label}. The link expires {new Date(result.expiresAt).toLocaleString()}.</p></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy/40">Secure signup link</p><div className="mt-2 break-all rounded-xl border border-navy/10 bg-offwhite p-3 text-xs text-navy/65">{invitationUrl}</div></div><div className="grid gap-3 sm:grid-cols-2"><button onClick={copyLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/10 px-4 py-3 text-sm font-bold text-navy"><Copy size={16}/>Copy link</button><button onClick={openGmail} className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-bold text-white"><Mail size={16}/>Open in Gmail<ExternalLink size={13}/></button></div><p className="text-xs leading-relaxed text-navy/40">Send the link only to the invited email address. The token is single-use and tied to that address.</p></div> : <form onSubmit={submit} className="space-y-5 p-5">{formError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{formError}</div>}<div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/40">Name</span><input value={form.name} onChange={event => update('name',event.target.value)} maxLength={180} className="input-field w-full px-4 py-3" placeholder="e.g. Aline Uwase"/></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/40">Email *</span><input required type="email" value={form.email} onChange={event => update('email',event.target.value)} className="input-field w-full px-4 py-3" placeholder="person@example.com"/></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/40">Training role *</span><select value={form.trainingRole} onChange={event => update('trainingRole',event.target.value)} className="input-field w-full px-4 py-3">{TRAINING_ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}</select><span className="mt-2 block text-xs text-navy/40">{selectedRole?.description}</span></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/40">Cohort or group</span><input value={form.group} onChange={event => update('group',event.target.value)} className="input-field w-full px-4 py-3" placeholder="Optional"/></label></div><div className="flex justify-end gap-3 border-t border-navy/8 pt-5"><button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-bold text-navy/50">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? <LoaderCircle className="animate-spin" size={15}/> : <Send size={15}/>}Create invitation</button></div></form>}
    </div>
  </div>;
}
