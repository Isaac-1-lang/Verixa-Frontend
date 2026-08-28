import {
  Building2, Users, MessageSquareText, GraduationCap, BrainCircuit,
  CreditCard, ShieldCheck, Rocket, BarChart3, Bell, Settings, UserCog
} from 'lucide-react';

export const moduleCatalog = {
  organizations: {
    title: 'Organizations', eyebrow: 'Tenant management', icon: Building2,
    description: 'Register, approve and manage customer organizations from one secure workspace.',
    action: 'Register organization', entity: 'organization',
    metrics: [['Active organizations', '—'], ['Pending approval', '—'], ['Members', '—']],
    columns: ['Organization', 'Status', 'Plan', 'Members'],
    empty: 'No organizations are available yet.',
    workflow: ['Application submitted', 'Platform review', 'Admin assigned', 'Workspace activated'],
    endpoints: ['GET /api/organizations', 'POST /api/organizations', 'PATCH /api/organizations/{id}/approval']
  },
  access: {
    title: 'People & access', eyebrow: 'Identity and permissions', icon: Users,
    description: 'Invite teammates, assign organization and project roles, and review access safely.',
    action: 'Invite member', entity: 'member',
    metrics: [['Active members', '—'], ['Pending invites', '—'], ['Project roles', '—']],
    columns: ['Member', 'Organization role', 'Projects', 'Status'],
    empty: 'No organization members are available yet.',
    workflow: ['Invite', 'Accept', 'Assign scope', 'Periodic review'],
    endpoints: ['GET /api/organizations/{id}/members', 'POST /api/organizations/{id}/invitations', 'PUT /api/projects/{id}/members/{userId}']
  },
  feedback: {
    title: 'Feedback hub', eyebrow: 'Client collaboration', icon: MessageSquareText,
    description: 'Capture structured UAT feedback, triage it, and turn accepted feedback into tracked work.',
    action: 'Capture feedback', entity: 'feedback item',
    metrics: [['New feedback', '—'], ['Awaiting response', '—'], ['Converted to defects', '—']],
    columns: ['Feedback', 'Source', 'Category', 'Status'],
    empty: 'No feedback has been submitted for this workspace.',
    workflow: ['Submitted', 'Triaged', 'Responded', 'Accepted or closed'],
    endpoints: ['GET /api/feedback', 'POST /api/feedback', 'PATCH /api/feedback/{id}/status', 'POST /api/feedback/{id}/convert-to-defect']
  },
  training: {
    title: 'Training', eyebrow: 'Enablement delivery', icon: GraduationCap,
    description: 'Plan user training, schedule sessions, assign trainers and track participant attendance.',
    action: 'Create training program', entity: 'training program',
    metrics: [['Active programs', '—'], ['Upcoming sessions', '—'], ['Participants', '—']],
    columns: ['Program', 'Trainer', 'Next session', 'Completion'],
    empty: 'No training programs have been created.',
    workflow: ['Plan program', 'Enroll participants', 'Deliver sessions', 'Confirm completion'],
    endpoints: ['GET /api/training/programs', 'POST /api/training/programs', 'POST /api/training/sessions', 'POST /api/training/enrollments']
  },
  competencies: {
    title: 'Competencies & assessments', eyebrow: 'User readiness', icon: BrainCircuit,
    description: 'Measure knowledge, collect training feedback and prove that users are ready for go-live.',
    action: 'Create assessment', entity: 'assessment',
    metrics: [['Assessments', '—'], ['Average score', '—'], ['Ready users', '—']],
    columns: ['Assessment', 'Audience', 'Pass mark', 'Completion'],
    empty: 'No competency assessments are configured.',
    workflow: ['Define competencies', 'Assess users', 'Close gaps', 'Approve readiness'],
    endpoints: ['GET /api/competencies', 'POST /api/assessments', 'POST /api/assessments/{id}/responses', 'GET /api/training/readiness']
  },
  billing: {
    title: 'Plans & billing', eyebrow: 'Commercial operations', icon: CreditCard,
    description: 'Manage subscriptions, add-ons, invoices and mobile-money payments for each customer.',
    action: 'Choose a plan', entity: 'subscription',
    metrics: [['Current plan', '—'], ['Monthly usage', '—'], ['Balance due', '—']],
    columns: ['Invoice', 'Period', 'Amount', 'Status'],
    empty: 'No billing history is available.',
    workflow: ['Select plan', 'Confirm payment', 'Activate subscription', 'Reconcile invoice'],
    endpoints: ['GET /api/billing/subscription', 'GET /api/billing/plans', 'POST /api/billing/checkout', 'POST /api/payments/pawapay']
  },
  readiness: {
    title: 'Deployment readiness', eyebrow: 'Go-live control', icon: Rocket,
    description: 'Combine testing, defects, sign-off, training and handover evidence into one release decision.',
    action: 'Create readiness review', entity: 'readiness review',
    metrics: [['Open blockers', '—'], ['Readiness score', '—'], ['Approvals', '—']],
    columns: ['Readiness item', 'Owner', 'Due date', 'Status'],
    empty: 'No readiness review exists for the selected project.',
    workflow: ['Collect evidence', 'Resolve blockers', 'Approve go-live', 'Complete handover'],
    endpoints: ['GET /api/projects/{id}/readiness', 'POST /api/projects/{id}/readiness', 'POST /api/handover', 'POST /api/deployments/{id}/approve']
  },
  reports: {
    title: 'Reports', eyebrow: 'Decision intelligence', icon: BarChart3,
    description: 'Generate project, UAT, defect, training, readiness and executive reports.',
    action: 'Create report', entity: 'report',
    metrics: [['Saved reports', '—'], ['Scheduled', '—'], ['Exports this month', '—']],
    columns: ['Report', 'Scope', 'Owner', 'Updated'],
    empty: 'No saved reports are available.',
    workflow: ['Choose scope', 'Configure measures', 'Review', 'Export or schedule'],
    endpoints: ['GET /api/reports', 'POST /api/reports', 'GET /api/reports/{id}/export', 'POST /api/reports/{id}/schedules']
  },
  admin: {
    title: 'Platform administration', eyebrow: 'Verixa operations', icon: ShieldCheck,
    description: 'Approve organizations, manage users, plans, permissions and platform health.',
    action: 'Review approvals', entity: 'admin task',
    metrics: [['Pending approvals', '—'], ['Active tenants', '—'], ['Platform alerts', '—']],
    columns: ['Task', 'Type', 'Submitted', 'Priority'],
    empty: 'There are no pending platform administration tasks.',
    workflow: ['Review request', 'Validate controls', 'Approve or reject', 'Audit action'],
    endpoints: ['GET /api/admin/organizations/pending', 'GET /api/admin/users', 'PUT /api/admin/users/{id}/roles', 'GET /api/admin/audit-log']
  },
  notifications: {
    title: 'Notifications', eyebrow: 'Work inbox', icon: Bell,
    description: 'Keep track of assignments, approvals, defects, training and billing events.',
    action: 'Notification settings', entity: 'notification rule',
    metrics: [['Unread', '—'], ['Assignments', '—'], ['Approvals', '—']],
    columns: ['Notification', 'Category', 'Received', 'Status'],
    empty: 'You are all caught up.',
    workflow: ['Event occurs', 'Rule evaluated', 'Notification delivered', 'Read or actioned'],
    endpoints: ['GET /api/notifications', 'PATCH /api/notifications/{id}/read', 'PUT /api/notifications/preferences']
  },
  settings: {
    title: 'Workspace settings', eyebrow: 'Configuration', icon: Settings,
    description: 'Configure organization defaults, lifecycle rules, integrations and data retention.',
    action: 'Save settings', entity: 'setting',
    metrics: [['Integrations', '—'], ['Retention policy', '—'], ['Audit controls', '—']],
    columns: ['Setting', 'Scope', 'Value', 'Updated'],
    empty: 'Workspace settings will appear when organization support is connected.',
    workflow: ['Configure', 'Validate', 'Publish', 'Audit changes'],
    endpoints: ['GET /api/organizations/{id}/settings', 'PUT /api/organizations/{id}/settings', 'GET /api/integrations']
  },
  users: {
    title: 'User administration', eyebrow: 'Account operations', icon: UserCog,
    description: 'Manage account status, roles, permissions and security reviews.',
    action: 'Add user', entity: 'user',
    metrics: [['Active users', '—'], ['Suspended', '—'], ['Security reviews', '—']],
    columns: ['User', 'Roles', 'Last active', 'Status'],
    empty: 'No managed user accounts are available.',
    workflow: ['Create or invite', 'Assign roles', 'Monitor access', 'Deactivate safely'],
    endpoints: ['GET /api/admin/users', 'PATCH /api/admin/users/{id}/status', 'PUT /api/admin/users/{id}/roles']
  }
};

export const getModule = (slug) => moduleCatalog[slug];
