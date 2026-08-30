export const TRAINING_SECTIONS = {
  programs: { title: 'Programs', singular: 'Program', description: 'Plan structured training for a project or audience.', statuses: ['DRAFT','PLANNED','ACTIVE','COMPLETED','CANCELLED'], fields: [
    { key:'description', label:'Description', type:'textarea', required:true }, { key:'objectives', label:'Learning objectives', type:'textarea' },
    { key:'startDate', label:'Start date', type:'date' }, { key:'endDate', label:'End date', type:'date' }, { key:'targetAudience', label:'Target audience' }, { key:'targetRoles', label:'Target roles' },
  ]},
  participants: { title:'Participants', singular:'Participant', description:'Maintain the people who need training.', statuses:['ACTIVE','INACTIVE'], fields:[
    { key:'email', label:'Email', type:'email', required:true }, { key:'jobRole', label:'Job role' }, { key:'phone', label:'Phone' }, { key:'group', label:'Group' },
  ]},
  sessions: { title:'Sessions', singular:'Session', description:'Schedule delivery and assign each session to a program.', statuses:['SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED'], fields:[
    { key:'programId', label:'Program', type:'relation', source:'programs', required:true }, { key:'sessionDate', label:'Date', type:'date', required:true },
    { key:'startTime', label:'Start time', type:'time', required:true }, { key:'endTime', label:'End time', type:'time', required:true }, { key:'deliveryMode', label:'Delivery mode', type:'select', options:['IN_PERSON','REMOTE','HYBRID'] }, { key:'location', label:'Location or meeting link' }, { key:'trainer', label:'Trainer' },
  ]},
  attendance: { title:'Attendance', singular:'Attendance record', description:'Record attendance for each participant and session.', statuses:['PENDING','PRESENT','ABSENT','LATE','EXCUSED'], fields:[
    { key:'sessionId', label:'Session', type:'relation', source:'sessions', required:true }, { key:'participantId', label:'Participant', type:'relation', source:'participants', required:true }, { key:'note', label:'Attendance note', type:'textarea' },
  ]},
  assessments: { title:'Assessments', singular:'Assessment', description:'Capture results and identify knowledge gaps.', statuses:['PENDING','PASSED','FAILED','REQUIRES_REVIEW'], fields:[
    { key:'participantId', label:'Participant', type:'relation', source:'participants', required:true }, { key:'programId', label:'Program', type:'relation', source:'programs' }, { key:'score', label:'Score', type:'number', required:true }, { key:'maximumScore', label:'Maximum score', type:'number', required:true }, { key:'notes', label:'Assessment notes', type:'textarea' },
  ]},
  feedback: { title:'Feedback', singular:'Feedback item', description:'Track training feedback, questions, and software issues.', statuses:['OPEN','IN_REVIEW','RESOLVED','CLOSED'], fields:[
    { key:'participantId', label:'Participant', type:'relation', source:'participants' }, { key:'sessionId', label:'Session', type:'relation', source:'sessions' }, { key:'category', label:'Category', type:'select', options:['TRAINING_CONTENT','USABILITY','SOFTWARE_ISSUE','QUESTION','OTHER'] }, { key:'severity', label:'Severity', type:'select', options:['LOW','MEDIUM','HIGH','CRITICAL'] }, { key:'details', label:'Details', type:'textarea', required:true },
  ]},
  readiness: { title:'Readiness', singular:'Readiness review', description:'Document whether participants are ready and why.', statuses:['NOT_STARTED','IN_PROGRESS','READY','FOLLOW_UP_REQUIRED','NOT_READY'], fields:[
    { key:'participantId', label:'Participant', type:'relation', source:'participants', required:true }, { key:'programId', label:'Program', type:'relation', source:'programs', required:true }, { key:'trainingStatus', label:'Training status', type:'select', options:['NOT_STARTED','IN_PROGRESS','COMPLETED'] }, { key:'followUpRequired', label:'Follow-up required', type:'select', options:['NO','YES'] }, { key:'explanation', label:'Readiness explanation', type:'textarea', required:true },
  ]},
  reports: { title:'Reports', singular:'Report', description:'Save training summaries and reporting periods.', statuses:['DRAFT','FINAL'], fields:[
    { key:'reportType', label:'Report type', type:'select', options:['PROGRAM_SUMMARY','ATTENDANCE','ASSESSMENT','READINESS','FEEDBACK'] }, { key:'periodFrom', label:'Period from', type:'date' }, { key:'periodTo', label:'Period to', type:'date' }, { key:'summary', label:'Executive summary', type:'textarea', required:true },
  ]},
};

export const emptyTrainingForm = (config) => ({ title:'', status:config.statuses[0], ...Object.fromEntries(config.fields.map(field => [field.key, ''])) });
export const trainingRows = (value) => value?.content ?? (Array.isArray(value) ? value : []);
export const prettyTrainingValue = (value) => String(value ?? '').replaceAll('_', ' ').toLowerCase().replace(/(^|\s)\S/g, letter => letter.toUpperCase());
