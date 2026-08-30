export const PROJECT_STAGES = [
  { value: 'INTERNAL_TESTING', label: 'Internal Testing', description: 'Validate the product internally before client testing.' },
  { value: 'UAT', label: 'User Acceptance Testing', description: 'Validate the product with client and business users.' },
  { value: 'TRAINING', label: 'Training', description: 'Train intended users and track their readiness.' },
  { value: 'GO_LIVE_READINESS', label: 'Go-Live Readiness', description: 'Review blockers before rollout.' },
  { value: 'LIVE', label: 'Live', description: 'The product is already in production.' },
];

export const projectRoute = (project) => project?.recommendedRoute || '/dashboard/projects';
