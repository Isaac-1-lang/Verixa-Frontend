"use client";

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Building2, Check, Fingerprint, Lock, Mail, User, Users } from 'lucide-react';
import AuthBackground from '@/app/components/auth/AuthBackground';
import AuthInput from '@/app/components/auth/AuthInput';
import { useLoginMutation, useRegisterMutation } from '@/app/redux/api/UserApiSlice';

const slugify = (value) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(() => ({ firstName: '', lastName: '', email: searchParams.get('email') || '', password: '', confirmPassword: '', onboardingMode: searchParams.get('mode') === 'JOIN' ? 'JOIN' : 'CREATE', organizationName: '', organizationSlug: '', invitationToken: searchParams.get('invitationToken') || '' }));
  const [registerUser, registration] = useRegisterMutation();
  const [loginUser, login] = useLoginMutation();
  const saving = registration.isLoading || login.isLoading;
  const steps = useMemo(() => form.onboardingMode === 'CREATE' ? ['Account', 'Organization', 'Details', 'Complete'] : ['Account', 'Organization', 'Complete'], [form.onboardingMode]);
  const currentLabel = steps[step - 1];

  const update = (field, value) => {
    setForm((previous) => {
      const next = { ...previous, [field]: value };
      if (field === 'organizationName' && previous.organizationSlug === slugify(previous.organizationName)) next.organizationSlug = slugify(value);
      return next;
    });
    setErrors((previous) => ({ ...previous, [field]: undefined, root: undefined }));
  };

  const validate = () => {
    const next = {};
    if (currentLabel === 'Account') {
      if (!form.firstName.trim()) next.firstName = 'Required';
      if (!form.lastName.trim()) next.lastName = 'Required';
      if (!form.email.trim()) next.email = 'Email is required';
      if (form.password.length < 8) next.password = 'Use at least 8 characters';
      if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    }
    if (currentLabel === 'Organization' && !['CREATE', 'JOIN', 'SKIP'].includes(form.onboardingMode)) next.onboardingMode = 'Choose an option';
    if (currentLabel === 'Details') {
      if (!form.organizationName.trim()) next.organizationName = 'Organization name is required';
      if (slugify(form.organizationSlug).length < 3) next.organizationSlug = 'Use at least 3 characters';
    }
    if (currentLabel === 'Complete' && form.onboardingMode === 'JOIN' && !form.invitationToken.trim()) next.invitationToken = 'Paste the secure invitation token';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => { if (validate()) setStep((value) => Math.min(value + 1, steps.length)); };
  const back = () => setStep((value) => Math.max(value - 1, 1));

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      const payload = { fullName: `${form.firstName} ${form.lastName}`.trim(), email: form.email.trim(), password: form.password, onboardingMode: form.onboardingMode };
      if (form.onboardingMode === 'CREATE') Object.assign(payload, { organizationName: form.organizationName.trim(), organizationSlug: slugify(form.organizationSlug) });
      if (form.onboardingMode === 'JOIN') payload.invitationToken = form.invitationToken.trim();
      const result = await registerUser(payload).unwrap();
      await loginUser({ email: form.email.trim(), password: form.password }).unwrap();
      router.replace(result?.hasAccessibleProjects ? '/dashboard' : (result?.nextRoute || '/dashboard'));
    } catch (error) {
      setErrors({ root: error?.data?.message || (error?.status === 'FETCH_ERROR' ? 'Cannot connect to the server.' : 'Registration failed. Please check your details and try again.') });
    }
  };

  return <div className="min-h-screen bg-white md:flex">
    <div className="hidden md:block md:w-1/2"><div className="fixed inset-y-0 left-0 w-1/2"><AuthBackground title="Set up your Verixa account" subtitle="Create or join an organization first. Projects stay separate and can be added whenever you are ready." /></div></div>
    <main className="flex min-h-screen items-center justify-center p-6 md:w-1/2 sm:p-10">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-7 inline-flex items-center gap-2 text-lg font-bold text-navy"><img src="/logo.png" alt="Verixa" className="h-8 w-8 rounded-lg bg-navy object-contain brightness-0 invert" />VERIXA</Link>
        <div className="mb-8 flex items-center gap-2">{steps.map((label, index) => <div key={label} className="flex min-w-0 flex-1 items-center gap-2"><div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${index + 1 <= step ? 'bg-navy text-white' : 'bg-navy/5 text-navy/30'}`}>{index + 1 < step ? <Check size={13} /> : index + 1}</div><span className={`hidden truncate text-xs font-bold sm:block ${index + 1 <= step ? 'text-navy' : 'text-navy/30'}`}>{label}</span></div>)}</div>
        <form onSubmit={submit}>
          <h1 className="text-3xl font-bold text-navy">{currentLabel}</h1>
          <p className="mb-6 mt-2 text-sm text-navy/45">Step {step} of {steps.length}</p>
          {errors.root && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{errors.root}</div>}

          {currentLabel === 'Account' && <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><AuthInput label="First Name" icon={User} value={form.firstName} onChange={(event) => update('firstName', event.target.value)} error={errors.firstName} /><AuthInput label="Last Name" icon={User} value={form.lastName} onChange={(event) => update('lastName', event.target.value)} error={errors.lastName} /></div><AuthInput label="Email" type="email" icon={Mail} value={form.email} onChange={(event) => update('email', event.target.value)} error={errors.email} /><AuthInput label="Password" type="password" icon={Lock} value={form.password} onChange={(event) => update('password', event.target.value)} error={errors.password} /><AuthInput label="Confirm Password" type="password" icon={Lock} value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} error={errors.confirmPassword} /></div>}

          {currentLabel === 'Organization' && <div className="space-y-3">{[
            ['CREATE', Building2, 'Create organization', 'Set up a new organization that you own.'],
            ['JOIN', Users, 'Join organization', 'Use a secure invitation issued to your email.'],
            ['SKIP', ArrowRight, 'Skip for now', 'Finish registration and go to the dashboard.'],
          ].map(([value, Icon, title, description]) => <button key={value} type="button" onClick={() => update('onboardingMode', value)} className={`w-full rounded-xl border p-4 text-left ${form.onboardingMode === value ? 'border-navy bg-navy/[.04]' : 'border-navy/10'}`}><span className="flex gap-3"><Icon size={20} className="mt-0.5 text-navy" /><span><span className="block text-sm font-bold text-navy">{title}</span><span className="mt-1 block text-xs text-navy/45">{description}</span></span></span></button>)}</div>}

          {currentLabel === 'Details' && <div className="space-y-4"><AuthInput label="Organization Name" icon={Building2} value={form.organizationName} onChange={(event) => update('organizationName', event.target.value)} error={errors.organizationName} /><AuthInput label="Organization Code" icon={Fingerprint} value={form.organizationSlug} onChange={(event) => update('organizationSlug', event.target.value)} error={errors.organizationSlug} /></div>}

          {currentLabel === 'Complete' && <div className="space-y-4">{form.onboardingMode === 'JOIN' && <AuthInput label="Invitation Token" icon={Fingerprint} value={form.invitationToken} onChange={(event) => update('invitationToken', event.target.value)} error={errors.invitationToken} placeholder="Paste the invitation token" />}<div className="rounded-xl border border-navy/10 bg-navy/[.03] p-5 text-sm text-navy/60"><p className="font-bold text-navy">Ready to register</p><p className="mt-1">No project will be created during registration. You can choose whether to create one immediately afterwards.</p></div></div>}

          <div className="mt-7 flex items-center justify-between gap-3">{step > 1 ? <button type="button" onClick={back} disabled={saving} className="inline-flex items-center gap-2 rounded-xl border border-navy/10 px-5 py-3 text-sm font-bold text-navy"><ArrowLeft size={15} />Back</button> : <span />} {step < steps.length ? <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white">Continue<ArrowRight size={15} /></button> : <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Creating account...' : 'Complete Registration'}<ArrowRight size={15} /></button>}</div>
        </form>
        <p className="mt-7 text-center text-sm text-navy/45">Already registered? <Link href="/auth/login" className="font-bold text-navy">Sign in</Link></p>
      </div>
    </main>
  </div>;
}

export default function SignUpPage() {
  return <Suspense fallback={<div className="grid min-h-screen place-items-center bg-white text-sm font-semibold text-navy/40">Preparing invitation...</div>}><SignUpForm /></Suspense>;
}
