'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCheck, ClipboardCheck, LoaderCircle, Plus, Search, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useAssignSessionParticipantsMutation,
  useCreateTrainingAssessmentMutation,
  useGetMeQuery,
  useGetTrainingParticipantsQuery,
  useGetTrainingSessionQuery,
  useRecordSessionAttendanceMutation,
  useUpdateTrainingSessionMutation,
} from '@/app/redux/api/TrainingApiSlice';

const pretty = value => String(value || '').replaceAll('_', ' ').toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());

export default function SessionDetail() {
  const { id } = useParams();
  const sessionId = Number(id);
  const me = useGetMeQuery();
  const organizationId = me.data?.organizations?.[0]?.id;
  const session = useGetTrainingSessionQuery(sessionId);
  const people = useGetTrainingParticipantsQuery(
    { organizationId, page: 0, size: 100 },
    { skip: !organizationId },
  );
  const [assign, assignState] = useAssignSessionParticipantsMutation();
  const [saveAttendance, attendanceState] = useRecordSessionAttendanceMutation();
  const [assess, assessmentState] = useCreateTrainingAssessmentMutation();
  const [updateSession, updateState] = useUpdateTrainingSessionMutation();
  const [selected, setSelected] = useState('');
  const [rosterSearch, setRosterSearch] = useState('');
  const [attendance, setAttendance] = useState({});
  const [assessment, setAssessment] = useState({
    participantId: '',
    assessmentType: 'PRACTICAL',
    score: '',
    evaluatorNotes: '',
  });

  const assigned = session.data?.participants || [];
  const assignedIds = useMemo(() => new Set(assigned.map(item => item.participant.id)), [assigned]);
  const available = (people.data?.content || []).filter(person => !assignedIds.has(person.id));
  const visibleAssigned = useMemo(() => {
    const query = rosterSearch.trim().toLowerCase();
    if (!query) return assigned;
    return assigned.filter(({ participant }) =>
      `${participant.name} ${participant.email}`.toLowerCase().includes(query),
    );
  }, [assigned, rosterSearch]);

  useEffect(() => {
    if (!session.data) return;
    setAttendance(Object.fromEntries(
      (session.data.participants || []).map(item => [item.participant.id, {
        status: item.attendanceStatus,
        note: item.note || '',
      }]),
    ));
  }, [session.data]);

  if (session.isLoading) {
    return <div className="grid min-h-[45vh] place-items-center"><LoaderCircle className="animate-spin text-navy/35" /></div>;
  }
  if (session.error) {
    return <div className="rounded-xl bg-red-50 p-5 text-red-700">{session.error?.data?.message || 'Session not found.'}</div>;
  }

  const add = async event => {
    event.preventDefault();
    try {
      const result = await assign({ sessionId, participantIds: [Number(selected)] }).unwrap();
      toast.success(`${result.assigned ?? result.added ?? 0} participant assigned`);
      setSelected('');
    } catch (error) {
      toast.error(error?.data?.message || 'Could not assign participant');
    }
  };

  const markAllPresent = () => {
    setAttendance(current => Object.fromEntries(assigned.map(item => [item.participant.id, {
      ...current[item.participant.id],
      status: 'PRESENT',
      note: current[item.participant.id]?.note || '',
    }])));
  };

  const record = async () => {
    try {
      await saveAttendance({
        sessionId,
        entries: assigned.map(item => ({
          participantId: item.participant.id,
          status: attendance[item.participant.id]?.status || 'PENDING',
          note: attendance[item.participant.id]?.note || '',
        })),
      }).unwrap();
      toast.success('Attendance saved');
    } catch (error) {
      toast.error(error?.data?.message || 'Could not save attendance');
    }
  };

  const submitAssessment = async event => {
    event.preventDefault();
    try {
      await assess({
        programId: session.data.programId,
        sessionId,
        participantId: Number(assessment.participantId),
        assessmentType: assessment.assessmentType,
        score: Number(assessment.score),
        evaluatorNotes: assessment.evaluatorNotes,
      }).unwrap();
      toast.success('Assessment recorded');
      setAssessment(current => ({ ...current, score: '', evaluatorNotes: '' }));
    } catch (error) {
      toast.error(error?.data?.message || 'Could not save assessment');
    }
  };

  const changeStatus = async status => {
    const current = session.data;
    try {
      await updateSession({
        id: sessionId,
        programId: current.programId,
        title: current.title,
        description: current.description,
        sessionDate: current.sessionDate,
        startTime: current.startTime,
        endTime: current.endTime,
        deliveryMode: current.deliveryMode,
        location: current.location,
        status,
        required: current.required,
        followUpSession: current.followUpSession,
        capacity: current.capacity,
        primaryTrainerParticipantId: current.primaryTrainer?.id,
      }).unwrap();
      toast.success(`Session marked ${pretty(status)}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Could not update session status');
    }
  };

  return <div className="space-y-5">
    <Link href="/dashboard/training/sessions" className="inline-flex items-center gap-2 text-sm font-bold text-navy/50">
      <ArrowLeft size={15} /> Sessions
    </Link>

    <header className="rounded-2xl bg-navy p-6 text-white">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-white/45">{pretty(session.data.deliveryMode)}</p>
        <select aria-label="Session status" value={session.data.status} disabled={updateState.isLoading} onChange={event => changeStatus(event.target.value)} className="ml-auto rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
          {['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(value => <option key={value} value={value} className="text-navy">{pretty(value)}</option>)}
        </select>
      </div>
      <h1 className="mt-2 text-3xl font-bold">{session.data.title}</h1>
      <p className="mt-2 text-sm text-white/60">{session.data.sessionDate} · {session.data.startTime}–{session.data.endTime}{session.data.location ? ` · ${session.data.location}` : ''}</p>
    </header>

    <section className="rounded-xl border border-navy/8 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Users size={17} />
        <h2 className="font-bold text-navy">Assign participants</h2>
        <span className="ml-auto text-xs font-bold text-navy/35">{assigned.length}{session.data.capacity ? ` / ${session.data.capacity}` : ''}</span>
      </div>
      <form onSubmit={add} className="flex gap-2">
        <select required value={selected} onChange={event => setSelected(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-navy/10 px-3 py-2.5 text-sm">
          <option value="">Choose an eligible unassigned participant…</option>
          {available.map(person => <option key={person.id} value={person.id}>{person.name} · {person.email}</option>)}
        </select>
        <button disabled={assignState.isLoading || !selected} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white disabled:opacity-40">
          <Plus size={15} /> Assign
        </button>
      </form>
    </section>

    <section className="overflow-hidden rounded-xl border border-navy/8 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-navy/7 p-5">
        <ClipboardCheck size={17} />
        <h2 className="font-bold text-navy">Attendance roster</h2>
        <label className="relative ml-auto min-w-52">
          <Search size={14} className="absolute left-3 top-2.5 text-navy/30" />
          <input value={rosterSearch} onChange={event => setRosterSearch(event.target.value)} placeholder="Find participant" className="w-full rounded-lg border border-navy/10 py-2 pl-9 pr-3 text-xs" />
        </label>
        <button type="button" onClick={markAllPresent} disabled={!assigned.length} className="inline-flex items-center gap-1 rounded-lg border border-navy/10 px-3 py-2 text-xs font-bold text-navy disabled:opacity-40">
          <CheckCheck size={14} /> Mark all present
        </button>
        <button type="button" onClick={record} disabled={attendanceState.isLoading || !assigned.length} className="rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white disabled:opacity-40">
          {attendanceState.isLoading ? 'Saving…' : 'Save all'}
        </button>
      </div>
      {visibleAssigned.length ? <div className="divide-y divide-navy/6">
        {visibleAssigned.map(item => <div key={item.participant.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_1fr]">
          <div>
            <p className="font-bold text-navy">{item.participant.name}</p>
            <p className="text-xs text-navy/40">{item.participant.email}</p>
          </div>
          <select value={attendance[item.participant.id]?.status || 'PENDING'} onChange={event => setAttendance(current => ({ ...current, [item.participant.id]: { ...current[item.participant.id], status: event.target.value } }))} className="rounded-lg border border-navy/10 px-3 py-2 text-sm">
            {['PENDING', 'PRESENT', 'LATE', 'ABSENT', 'EXCUSED'].map(value => <option key={value}>{value}</option>)}
          </select>
          <input value={attendance[item.participant.id]?.note || ''} onChange={event => setAttendance(current => ({ ...current, [item.participant.id]: { ...current[item.participant.id], note: event.target.value } }))} placeholder="Optional note" className="rounded-lg border border-navy/10 px-3 py-2 text-sm" />
        </div>)}
      </div> : <p className="p-10 text-center text-sm text-navy/40">{assigned.length ? 'No roster entries match the search.' : 'Assign participants before recording attendance.'}</p>}
    </section>

    <section className="rounded-xl border border-navy/8 bg-white p-5">
      <h2 className="font-bold text-navy">Record assessment</h2>
      <p className="mt-1 text-xs text-navy/40">Assessments are evidence tied to this program, session, and person.</p>
      <form onSubmit={submitAssessment} className="mt-4 grid gap-3 md:grid-cols-[1fr_190px_120px_1fr_auto]">
        <select required value={assessment.participantId} onChange={event => setAssessment({ ...assessment, participantId: event.target.value })} className="rounded-lg border border-navy/10 px-3 py-2 text-sm">
          <option value="">Participant…</option>
          {assigned.map(item => <option key={item.participant.id} value={item.participant.id}>{item.participant.name}</option>)}
        </select>
        <select value={assessment.assessmentType} onChange={event => setAssessment({ ...assessment, assessmentType: event.target.value })} className="rounded-lg border border-navy/10 px-3 py-2 text-sm">
          {['PRACTICAL', 'TRAINER_EVALUATION', 'QUIZ', 'SELF_CONFIRMATION', 'OBSERVATION', 'CERTIFICATION', 'OTHER'].map(value => <option key={value}>{pretty(value)}</option>)}
        </select>
        <input required min="0" max="100" type="number" value={assessment.score} onChange={event => setAssessment({ ...assessment, score: event.target.value })} placeholder="Score %" className="rounded-lg border border-navy/10 px-3 py-2 text-sm" />
        <input value={assessment.evaluatorNotes} onChange={event => setAssessment({ ...assessment, evaluatorNotes: event.target.value })} placeholder="Evaluator notes" className="rounded-lg border border-navy/10 px-3 py-2 text-sm" />
        <button disabled={assessmentState.isLoading || !assigned.length} className="rounded-lg bg-navy px-4 text-sm font-bold text-white disabled:opacity-40">Save</button>
      </form>
    </section>
  </div>;
}
