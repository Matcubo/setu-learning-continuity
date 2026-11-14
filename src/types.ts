export type Subject = 'Mathematics' | 'Science'

export type Topic = {
  id: string
  title: string
  description?: string
}

export type Curriculum = {
  id: string
  title: string
  grade: string
  state: string
  subjects: Record<Subject, Topic[]>
  note?: string
}

export type EvidenceItem = {
  subject: Subject
  topicId: string
  evidenceType: 'assessment' | 'teacherObservation' | 'certificate'
  note?: string
}

export type AcademicRecord = {
  subject: Subject
  completedTopicIds: string[]
  observations?: string
}

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
  status: 'new' | 'under_review' | 'approved'
  plan?: TransitionPlan
  createdAt: string
}

export type TopicMatch = {
  topic: Topic
  evidenceFor?: EvidenceItem[]
  status: 'confirmed' | 'possible' | 'unknown'
}

export type CurriculumComparison = {
  subject: Subject
  confirmed: TopicMatch[]
  possible: TopicMatch[]
  unknown: TopicMatch[]
}

export type WeeklyPlan = {
  week: number
  objectives: string[]
  activities: string[]
  assessment: string
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
