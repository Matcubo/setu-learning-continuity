import { TransitionCase } from '../types'
import { curricula } from './curricula'

const now = new Date().toISOString()

export const sampleCases: TransitionCase[] = [
  {
    id: 'case-1',
    studentName: 'Asha (demo)',
    currentClass: '6',
    sourceState: 'Bihar',
    destinationState: 'Gujarat',
    previousLanguage: 'Hindi',
    preferredLanguage: 'Gujarati',
    sourceCurriculumId: 'bihar-class6-std',
    destinationCurriculumId: 'gujarat-class6-std',
    academicRecords: [
      { subject: 'Mathematics', completedTopicIds: ['m-num-fractions', 'm-geom-basic'], observations: 'Comfortable with fractions and basic shapes.' },
      { subject: 'Science', completedTopicIds: ['s-life-cells'], observations: 'Knows cells but limited lab experience.' }
    ],
    evidence: [
      { subject: 'Mathematics', topicId: 'm-num-fractions', evidenceType: 'assessment', note: 'Assessment score 78%' },
      { subject: 'Mathematics', topicId: 'm-geom-basic', evidenceType: 'teacherObservation', note: 'Class activities completed' },
      { subject: 'Science', topicId: 's-life-cells', evidenceType: 'assessment', note: 'Identifies cell parts' }
    ],
    teacherNotes: 'Transferred mid-year. Needs language support.',
    status: 'new',
    plan: undefined,
    createdAt: now
  },
  {
    id: 'case-2',
    studentName: 'Vikram (demo)',
    currentClass: '6',
    sourceState: 'Bihar',
    destinationState: 'Gujarat',
    previousLanguage: 'Hindi',
    preferredLanguage: 'Gujarati',
    sourceCurriculumId: 'bihar-class6-std',
    destinationCurriculumId: 'gujarat-class6-std',
    academicRecords: [
      { subject: 'Mathematics', completedTopicIds: ['m-num-fractions'], observations: 'Understands fractions but not data handling yet.' },
      { subject: 'Science', completedTopicIds: [], observations: 'Limited evidence available.' }
    ],
    evidence: [
      { subject: 'Mathematics', topicId: 'm-num-fractions', evidenceType: 'teacherObservation', note: 'Practiced in class' }
    ],
    teacherNotes: '',
    status: 'under_review',
    plan: undefined,
    createdAt: now
  },
  {
    id: 'case-3',
    studentName: 'Meera (demo)',
    currentClass: '6',
    sourceState: 'Bihar',
    destinationState: 'Gujarat',
    previousLanguage: 'Hindi',
    preferredLanguage: 'Gujarati',
    sourceCurriculumId: 'bihar-class6-std',
    destinationCurriculumId: 'gujarat-class6-std',
    academicRecords: [
      { subject: 'Mathematics', completedTopicIds: ['m-data-intro'], observations: 'Able to read simple bar graphs.' },
      { subject: 'Science', completedTopicIds: ['s-chem-matter'], observations: 'Knows states of matter.' }
    ],
    evidence: [
      { subject: 'Science', topicId: 's-chem-matter', evidenceType: 'assessment', note: 'Task completed' },
      { subject: 'Mathematics', topicId: 'm-data-intro', evidenceType: 'assessment', note: 'Graph reading test' }
    ],
    teacherNotes: 'Curious learner.',
    status: 'approved',
    plan: undefined,
    createdAt: now
  },
  {
    id: 'case-4',
    studentName: 'Rahul (demo)',
    currentClass: '6',
    sourceState: 'Bihar',
    destinationState: 'Gujarat',
    previousLanguage: 'Hindi',
    preferredLanguage: 'Gujarati',
    sourceCurriculumId: 'bihar-class6-std',
    destinationCurriculumId: 'gujarat-class6-std',
    academicRecords: [
      { subject: 'Mathematics', completedTopicIds: [], observations: 'No academic records provided.' },
      { subject: 'Science', completedTopicIds: [], observations: '' }
    ],
    evidence: [],
    teacherNotes: 'Family moved recently. No records.' ,
    status: 'new',
    plan: undefined,
    createdAt: now
  },
  {
    id: 'case-5',
    studentName: 'Sangeeta (demo)',
    currentClass: '6',
    sourceState: 'Bihar',
    destinationState: 'Gujarat',
    previousLanguage: 'Hindi',
    preferredLanguage: 'Gujarati',
    sourceCurriculumId: 'bihar-class6-std',
    destinationCurriculumId: 'gujarat-class6-std',
    academicRecords: [
      { subject: 'Mathematics', completedTopicIds: ['m-num-fractions','m-data-intro'], observations: 'Participates well.' },
      { subject: 'Science', completedTopicIds: ['s-life-cells','s-chem-matter'], observations: 'Has practical experience.' }
    ],
    evidence: [
      { subject: 'Mathematics', topicId: 'm-num-fractions', evidenceType: 'assessment', note: '85%' },
      { subject: 'Science', topicId: 's-chem-matter', evidenceType: 'teacherObservation', note: 'Practical tasks' }
    ],
    teacherNotes: '',
    status: 'approved',
    plan: undefined,
    createdAt: now
  }
]

export default sampleCases
