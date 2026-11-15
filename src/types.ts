export type RegionCategory = 'state' | 'union-territory'

export type BoardType = 'national' | 'regional' | 'other' | 'teacher-defined'

export type Subject =
  | 'Mathematics'
  | 'Science'
  | 'Environmental Studies'
  | 'English'
  | 'Hindi'
  | 'Regional Language'
  | 'Social Science'
  | 'Computer Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Accountancy'
  | 'Business Studies'
  | 'Economics'
  | 'Other / custom subject'

export type SchoolStage = 'Foundational' | 'Preparatory' | 'Middle' | 'Secondary'

export type Topic = {
  id: string
  title: string
  description?: string
}

export type StateOption = {
  id: string
  name: string
  shortName?: string
  regionType: RegionCategory
}

export type Board = {
  id: string
  name: string
  type: BoardType
  region: 'National' | 'Regional' | 'Custom'
}

export type Curriculum = {
  id: string
  title: string
  grade: string
  state: string
  board?: string
  subjects: Record<string, Topic[]>
  note?: string
}

export type EvidenceItem = {
  subject: Subject | string
  topicId: string
  evidenceType: 'assessment' | 'teacherObservation' | 'certificate'
  note?: string
}

export type AcademicRecord = {
  subject: Subject | string
  completedTopicIds: string[]
  observations?: string
}

export type TransitionStatus = 'new' | 'under_review' | 'approved'

export type TransitionCase = {
  id: string
  studentName: string
  currentClass: string
  sourceState: string
  destinationState: string
  previousLanguage: string
  preferredLanguage: string
  sourceCurriculumId: string
  destinationCurriculumId: string
  academicRecords: AcademicRecord[]
  evidence: EvidenceItem[]
  teacherNotes?: string
  status: TransitionStatus
  plan?: TransitionPlan
  createdAt: string
  schoolStage?: SchoolStage
  board?: string
  grade?: string
}

export type TopicMatch = {
  topic: Topic
  evidenceFor?: EvidenceItem[]
  status: 'confirmed' | 'possible' | 'unknown'
  explanation: string
  evidenceReference: string
  teacherReviewRequired: boolean
}

export type CurriculumComparison = {
  subject: Subject | string
  confirmed: TopicMatch[]
  possible: TopicMatch[]
  unknown: TopicMatch[]
}

export type WeeklyPlan = {
  week: number
  objectives: string[]
  activities: string[]
  resources: string[]
  assessment: string
  expectedOutcome: string
}

export type TransitionPlan = {
  id: string
  generatedAt: string
  languageAdaptationNotes?: string
  weeks: WeeklyPlan[]
  priorityTopics: Topic[]
  teacherComments?: string
  approved?: boolean
}
