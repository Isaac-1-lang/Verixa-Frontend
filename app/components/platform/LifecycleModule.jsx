'use client';

import { useMemo, useState } from 'react';
import { Check, DatabaseZap, Plus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LifecycleModule({ moduleKey, config }) {
  const Icon = config.icon;
  const storageKey = `verixa:drafts:${moduleKey}`;
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  const visible = useMemo(() => drafts.filter((item) =>
    `${item.name} ${item.details}`.toLowerCase().includes(query.toLowerCase())
  ), [drafts, query]);

  const saveDraft = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const next = [{ id: crypto.randomUUID(), name: name.trim(), details: details.trim(), status: 'DRAFT', createdAt: new Date().toISOString() }, ...drafts];
    setDrafts(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setName(''); setDetails(''); setOpen(false);
    toast.success(`${config.entity} draft saved on this device`);
  };

  return (
    <div className='max-w-[1440px] mx-auto space-y-6'>
      <section className='relative overflow-hidden rounded-2xl bg-navy text-white p-6 sm:p-8 shadow-xl shadow-navy/10'>
        <div className='absolute -right-20 -top-24 w-72 h-72 rounded-full border-[48px] border-white/[0.035]' />
        <div className='relative flex flex-col lg:flex-row lg:items-end justify-between gap-6'>
          <div className='max-w-2xl'>
            <div className='flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50'>
              <Icon size={15} /> {config.eyebrow}
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold mt-4 tracking-tight'>{config.title}</h1>
            <p className='text-white/60 mt-3 max-w-xl'>{config.description}</p>
          </div>
          <button onClick={() => setOpen(true)} className='inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-navy font-bold text-sm hover:bg-white/90 transition-colors'>
            <Plus size={16} /> {config.action}
          </button>
        </div>
      </section>

      <div className='grid sm:grid-cols-3 gap-4'>
        {config.metrics.map(([label, value]) => (
          <div key={label} className='bg-white border border-navy/8 rounded-xl p-5 shadow-sm'>
            <p className='text-xs font-semibold text-navy/40'>{label}</p>
            <p className='text-2xl font-bold text-navy mt-2'>{value}</p>
            <p className='text-[11px] text-amber-600 mt-2'>Waiting for backend data</p>
          </div>
        ))}
      </div>

      <section className='grid xl:grid-cols-[1fr_340px] gap-5'>
        <div className='bg-white border border-navy/8 rounded-xl overflow-hidden shadow-sm'>
          <div className='p-4 border-b border-navy/6 flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
            <div><h2 className='font-bold text-navy'>Workspace</h2><p className='text-xs text-navy/40'>Backend records and local drafts</p></div>
            <label className='relative block'>
              <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-navy/30' />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search...' className='pl-9 pr-3 py-2 rounded-md border border-navy/10 text-sm outline-none focus:border-navy/30' />
            </label>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead><tr className='bg-offwhite text-[11px] uppercase tracking-wider text-navy/40'>{config.columns.map((column) => <th key={column} className='px-5 py-3 font-bold'>{column}</th>)}</tr></thead>
              <tbody>
                {visible.map((item) => (
                  <tr key={item.id} className='border-t border-navy/5'>
                    <td className='px-5 py-4'><p className='font-bold text-sm text-navy'>{item.name}</p><p className='text-xs text-navy/40 mt-1'>{item.details || `Local ${config.entity} draft`}</p></td>
                    <td className='px-5 py-4'><span className='badge'>{item.status}</span></td>
                    <td className='px-5 py-4 text-sm text-navy/50'>Not connected</td>
                    <td className='px-5 py-4 text-xs text-navy/40'>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!visible.length && <div className='py-16 px-6 text-center'><Icon size={28} className='mx-auto text-navy/20' /><p className='font-semibold text-navy mt-3'>{config.empty}</p><p className='text-sm text-navy/40 mt-1'>Create a draft now; it can be submitted once the backend endpoints are available.</p></div>}
        </div>

        <aside className='space-y-5'>
          <div className='bg-white border border-navy/8 rounded-xl p-5 shadow-sm'>
            <h2 className='font-bold text-navy'>Recommended workflow</h2>
            <div className='mt-4 space-y-3'>{config.workflow.map((step, index) => <div key={step} className='flex gap-3 items-center'><span className='w-7 h-7 rounded-full bg-navy text-white text-xs grid place-items-center font-bold'>{index + 1}</span><span className='text-sm font-semibold text-navy/65'>{step}</span></div>)}</div>
          </div>
          <div className='bg-amber-50 border border-amber-200 rounded-xl p-5'>
            <div className='flex items-center gap-2 text-amber-800 font-bold'><DatabaseZap size={17} /> Backend connection required</div>
            <p className='text-xs text-amber-800/70 mt-2'>The complete interface is ready for these contracts:</p>
            <ul className='mt-3 space-y-2'>{config.endpoints.map((endpoint) => <li key={endpoint} className='font-mono text-[10px] text-amber-900 bg-white/60 rounded px-2 py-1.5'>{endpoint}</li>)}</ul>
          </div>
        </aside>
      </section>

      {open && <div className='fixed inset-0 z-[80] bg-navy/50 backdrop-blur-sm grid place-items-center p-4' onMouseDown={() => setOpen(false)}>
        <form onSubmit={saveDraft} onMouseDown={(e) => e.stopPropagation()} className='bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6'>
          <div className='flex items-start justify-between'><div><h2 className='text-xl font-bold text-navy'>{config.action}</h2><p className='text-sm text-navy/40 mt-1'>Save a frontend draft until backend submission is available.</p></div><button type='button' onClick={() => setOpen(false)} className='p-2 text-navy/40'><X size={18} /></button></div>
          <label className='block mt-6 text-xs font-bold text-navy/60'>Name<input autoFocus required value={name} onChange={(e) => setName(e.target.value)} className='mt-2 w-full input-field px-4 py-3' placeholder={`Name this ${config.entity}`} /></label>
          <label className='block mt-4 text-xs font-bold text-navy/60'>Details<textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={4} className='mt-2 w-full input-field px-4 py-3 resize-none' placeholder='Add scope, owner, dates or notes...' /></label>
          <div className='flex justify-end gap-3 mt-6'><button type='button' onClick={() => setOpen(false)} className='px-4 py-2 rounded-md border border-navy/10 font-semibold text-sm'>Cancel</button><button className='px-5 py-2 rounded-md bg-navy text-white font-bold text-sm flex items-center gap-2'><Check size={15} /> Save draft</button></div>
        </form>
      </div>}
    </div>
  );
}
