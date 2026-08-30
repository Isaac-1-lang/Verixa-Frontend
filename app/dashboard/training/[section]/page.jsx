'use client';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, Archive, BookOpen, LoaderCircle, Pencil, Plus, RefreshCw, Search, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useArchiveTrainingRecordMutation, useCreateTrainingRecordMutation, useGetMeQuery, useGetTrainingSectionQuery, useUpdateTrainingRecordMutation } from '@/app/redux/api/TrainingApiSlice';
import { TRAINING_SECTIONS, emptyTrainingForm, prettyTrainingValue, trainingRows } from '@/app/config/trainingSections';
import TrainingInviteModal from '@/app/components/training/TrainingInviteModal';

const relationLabel = (row) => row?.title || `Record #${row?.id}`;

export default function TrainingSectionPage() {
  const { section } = useParams();
  const config = TRAINING_SECTIONS[section];
  const me = useGetMeQuery();
  const organizationId = me.data?.organizations?.[0]?.id;
  const records = useGetTrainingSectionQuery({ section, organizationId }, { skip: !config || !organizationId });
  const programs = useGetTrainingSectionQuery({ section:'programs', organizationId }, { skip: !organizationId || section === 'programs' });
  const participants = useGetTrainingSectionQuery({ section:'participants', organizationId }, { skip: !organizationId || section === 'participants' });
  const sessions = useGetTrainingSectionQuery({ section:'sessions', organizationId }, { skip: !organizationId || section === 'sessions' });
  const [createRecord, creating] = useCreateTrainingRecordMutation();
  const [updateRecord, updating] = useUpdateTrainingRecordMutation();
  const [archiveRecord, archiving] = useArchiveTrainingRecordMutation();
  const [form, setForm] = useState(() => config ? emptyTrainingForm(config) : {});
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);

  const relationRows = { programs: trainingRows(programs.data), participants: trainingRows(participants.data), sessions: trainingRows(sessions.data) };
  const rows = useMemo(() => trainingRows(records.data).filter(row => !query || `${row.title} ${row.status} ${Object.values(row.data || {}).join(' ')}`.toLowerCase().includes(query.toLowerCase())), [records.data, query]);
  if (!config) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">Unknown training section.</div>;

  const openCreate = () => { setEditing(null); setForm(emptyTrainingForm(config)); setFormError(''); setFormOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm({ title:row.title, status:row.status, ...row.data }); setFormError(''); setFormOpen(true); };
  const close = () => { if (!creating.isLoading && !updating.isLoading) setFormOpen(false); };
  const setValue = (key, value) => setForm(previous => ({ ...previous, [key]:value }));

  const submit = async (event) => {
    event.preventDefault();
    const missing = config.fields.find(field => field.required && !String(form[field.key] ?? '').trim());
    if (!form.title.trim() || missing) { setFormError(!form.title.trim() ? 'Title or participant name is required.' : `${missing.label} is required.`); return; }
    const data = Object.fromEntries(config.fields.map(field => [field.key, form[field.key] ?? '']));
    const payload = { section, organizationId, type:section.toUpperCase(), title:form.title.trim(), status:form.status, data };
    try {
      if (editing) await updateRecord({ ...payload, id:editing.id, version:editing.version }).unwrap();
      else await createRecord(payload).unwrap();
      toast.success(`${config.singular} ${editing ? 'updated' : 'created'}`);
      setFormOpen(false);
    } catch (error) { setFormError(error?.data?.message || `Could not save ${config.singular.toLowerCase()}.`); }
  };

  const remove = async (row) => {
    if (!window.confirm(`Archive “${row.title}”?`)) return;
    try { await archiveRecord({ section, id:row.id }).unwrap(); toast.success(`${config.singular} archived`); }
    catch (error) { toast.error(error?.data?.message || 'Could not archive record.'); }
  };

  const changeStatus = async (row, status) => {
    try { await updateRecord({ section, id:row.id, organizationId, type:section.toUpperCase(), title:row.title, status, data:row.data, version:row.version }).unwrap(); }
    catch (error) { toast.error(error?.data?.message || 'Could not update status.'); }
  };

  const renderField = (field) => {
    const common = { value:form[field.key] ?? '', onChange:event => setValue(field.key,event.target.value), required:field.required, className:'w-full rounded-lg border border-navy/10 bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-navy/40' };
    if (field.type === 'textarea') return <textarea {...common} rows={3} />;
    if (field.type === 'select') return <select {...common}><option value="">Select…</option>{field.options.map(option => <option key={option} value={option}>{prettyTrainingValue(option)}</option>)}</select>;
    if (field.type === 'relation') {
      const choices = relationRows[field.source].filter(row => !field.trainingRoles || field.trainingRoles.includes(row.data?.trainingRole));
      return <select {...common}><option value="">Select...</option>{choices.map(row => <option key={row.id} value={row.id}>{relationLabel(row)}</option>)}</select>;
    }
    return <input {...common} type={field.type || 'text'} />;
  };

  if (me.isLoading || records.isLoading) return <div className="grid min-h-[50vh] place-items-center text-navy/40"><LoaderCircle className="animate-spin" size={30} /></div>;
  if (!organizationId) return <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900"><strong>No organization selected.</strong><p className="mt-1 text-sm">Create or join an organization before managing training.</p></div>;
  if (records.error) return <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"><AlertTriangle className="mx-auto text-red-500" /><p className="mt-3 font-bold text-navy">{config.title} could not be loaded</p><button onClick={records.refetch} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white"><RefreshCw size={14}/>Retry</button></div>;

  return <div className="space-y-5">
    <header className="flex flex-col justify-between gap-4 rounded-2xl border border-navy/8 bg-white p-6 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-navy">{config.title}</h1><p className="mt-1 text-sm text-navy/45">{config.description}</p></div><div className="flex flex-col gap-2 sm:flex-row">{section === 'participants' && <button onClick={() => setInviteOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy/15 px-5 py-3 text-sm font-bold text-navy"><UserPlus size={16}/>Invite person</button>}<button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white"><Plus size={16}/>Add {config.singular}</button></div></header>
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/25" size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}…`} className="w-full rounded-xl border border-navy/8 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-navy/30" /></div>
    {rows.length ? <div className="grid gap-4 lg:grid-cols-2">{rows.map(row => <article key={row.id} className="rounded-xl border border-navy/8 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="truncate font-bold text-navy">{row.title}</p><p className="mt-1 text-xs text-navy/35">Updated {new Date(row.updatedAt || row.createdAt).toLocaleDateString()}</p></div><select aria-label={`Status for ${row.title}`} value={row.status} onChange={event => changeStatus(row,event.target.value)} disabled={updating.isLoading} className="rounded-md border border-navy/10 bg-navy/[.03] px-2 py-1 text-xs font-bold text-navy">{config.statuses.map(status => <option key={status}>{status}</option>)}</select></div><dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">{config.fields.filter(field => row.data?.[field.key] !== '' && row.data?.[field.key] != null).slice(0,6).map(field => <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}><dt className="text-[10px] font-bold uppercase tracking-wider text-navy/30">{field.label}</dt><dd className="mt-0.5 break-words text-sm font-semibold text-navy/65">{field.type === 'relation' ? relationLabel(relationRows[field.source].find(item => String(item.id) === String(row.data[field.key]))) : prettyTrainingValue(row.data[field.key])}</dd></div>)}</dl><div className="mt-5 flex justify-end gap-2 border-t border-navy/5 pt-4"><button onClick={() => openEdit(row)} className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold text-navy hover:bg-navy/5"><Pencil size={13}/>Edit</button><button onClick={() => remove(row)} disabled={archiving.isLoading} className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><Archive size={13}/>Archive</button></div></article>)}</div> : <div className="rounded-2xl border border-dashed border-navy/15 bg-white p-12 text-center"><BookOpen className="mx-auto text-navy/15" size={34}/><p className="mt-4 font-bold text-navy">No {config.title.toLowerCase()} yet</p><p className="mt-1 text-sm text-navy/40">Add the first {config.singular.toLowerCase()} to begin.</p><button onClick={openCreate} className="mt-5 rounded-lg bg-navy px-4 py-2.5 text-sm font-bold text-white">Add {config.singular}</button></div>}

    {formOpen && <div className="fixed inset-0 z-[1000] grid place-items-center bg-navy/25 p-4 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget) close(); }}><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-navy/8 p-5"><div><h2 className="text-lg font-bold text-navy">{editing ? 'Edit' : 'Add'} {config.singular}</h2><p className="text-xs text-navy/40">Saved to {me.data?.organizations?.[0]?.name}</p></div><button onClick={close} className="rounded-lg p-2 text-navy/35 hover:bg-navy/5"><X size={18}/></button></div><form onSubmit={submit} className="space-y-5 p-5">{formError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{formError}</div>}<div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/40">{section === 'participants' ? 'Full name' : 'Title'} *</span><input value={form.title} onChange={event => setValue('title',event.target.value)} required maxLength={180} className="w-full rounded-lg border border-navy/10 px-3 py-2.5 text-sm outline-none focus:border-navy/40" /></label><label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/40">Status</span><select value={form.status} onChange={event => setValue('status',event.target.value)} className="w-full rounded-lg border border-navy/10 px-3 py-2.5 text-sm">{config.statuses.map(status => <option key={status}>{status}</option>)}</select></label>{config.fields.map(field => <label key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}><span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/40">{field.label}{field.required ? ' *' : ''}</span>{renderField(field)}</label>)}</div><div className="flex justify-end gap-3 border-t border-navy/8 pt-5"><button type="button" onClick={close} className="rounded-lg px-5 py-2.5 text-sm font-bold text-navy/55">Cancel</button><button disabled={creating.isLoading || updating.isLoading} className="rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{creating.isLoading || updating.isLoading ? 'Saving…' : 'Save'}</button></div></form></div></div>}
    {inviteOpen && <TrainingInviteModal organization={me.data.organizations[0]} onClose={() => setInviteOpen(false)} />}
  </div>;
}
