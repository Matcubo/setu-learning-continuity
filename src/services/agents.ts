import { CurriculumComparison, TransitionCase } from '../types'
import { curricula } from '../data/curricula'

const subjectOrder = ['Mathematics', 'Science'] as const

export function compareCurricula(caseData: TransitionCase): CurriculumComparison[] {
  if (!caseData.sourceCurriculumId || !caseData.destinationCurriculumId) return []

  const source = curricula.find((c) => c.id === caseData.sourceCurriculumId)
  const dest = curricula.find((c) => c.id === caseData.destinationCurriculumId)
  if (!source || !dest) return []

  return subjectOrder.map((subject) => {
    const destinationTopics = dest.subjects[subject] ?? []
    const sourceTopics = source.subjects[subject] ?? []
    const confirmed: any[] = []
    const possible: any[] = []
    const unknown: any[] = []

    destinationTopics.forEach((topic) => {
      const sourceMatch = sourceTopics.find((sourceTopic) => sourceTopic.id === topic.id)
      const evidence = caseData.evidence.filter((entry) => entry.subject === subject && entry.topicId === topic.id)
      const evidenceReference = evidence.length
        ? evidence.map((entry) => `${entry.evidenceType}: ${entry.note || 'No note recorded'}`).join(' • ')
        : 'No direct evidence recorded'

      if (sourceMatch && evidence.length > 0) {
        confirmed.push({
          topic,
          evidenceFor: evidence,
          status: 'confirmed',
          explanation: `This topic is taught in the source curriculum and supported by recorded classroom evidence for ${caseData.studentName}.`,
          evidenceReference,
          teacherReviewRequired: false,
        })
      } else if (sourceMatch) {
        possible.push({
          topic,
          evidenceFor: evidence,
          status: 'possible',
          explanation: `The topic appears in the source curriculum, but evidence is limited or missing, so it should be checked before assuming mastery.`,
          evidenceReference,
          teacherReviewRequired: true,
        })
      } else {
        unknown.push({
          topic,
          evidenceFor: evidence,
          status: 'unknown',
          explanation: `This destination topic is not directly matched to the source curriculum and should be treated as a potential learning gap unless teacher review confirms prior learning.`,
          evidenceReference,
          teacherReviewRequired: true,
        })
      }
    })

    return { subject, confirmed, possible, unknown }
  })
}

export function generateTransitionPlan(caseData: TransitionCase, comparisons: CurriculumComparison[]) {
  const fallbackWeeks = [
    {
      week: 1,
      objectives: ['Establish a baseline in the new classroom language and routines.'],
      activities: ['Use bilingual vocabulary cards, oral warm-ups, and teacher modeling to build confidence.'],
      resources: ['Visual prompts', 'Bilingual glossary', 'Teacher-led check-in'],
      assessment: 'Teacher observes speaking confidence and participation during the first week of class.',
      expectedOutcome: 'The learner feels more comfortable with classroom routines and the language of instruction.',
    },
    {
      week: 2,
      objectives: ['Identify priority concepts that need reinforcement through the transition period.'],
      activities: ['Review key concepts with short explanations, examples and paired practice.'],
      resources: ['Classroom examples', 'Short worksheets', 'Reference notes'],
      assessment: 'Quick oral or written check for understanding of the week’s priority ideas.',
      expectedOutcome: 'The learner can explain or demonstrate the key concept with teacher support.',
    },
    {
      week: 3,
      objectives: ['Reinforce learning with connected practice and guided application.'],
      activities: ['Practice tasks with scaffolded support, peer discussion, and teacher feedback.'],
      resources: ['Guided tasks', 'Peer support', 'Teacher feedback notes'],
      assessment: 'Teacher checks whether the learner can complete a short scaffolded task independently.',
      expectedOutcome: 'The learner shows consistent participation and improved confidence in applying learning.',
    },
    {
      week: 4,
      objectives: ['Review progress and prepare the next-step learning plan.'],
      activities: ['Retest skills, summarise gains and identify any remaining support needs.'],
      resources: ['Review sheet', 'Teacher notes', 'Family or school handoff summary'],
      assessment: 'Simple exit check covering language, concept recall and class participation.',
      expectedOutcome: 'The team has a clear view of the student’s transition readiness and next support actions.',
    },
  ]

  if (!comparisons || comparisons.length === 0) {
    return {
      id: `plan-${caseData.id}-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      languageAdaptationNotes: `Curriculum mapping pending. Preferred teaching language: ${caseData.preferredLanguage}. Use bilingual explanations, visual prompts and teacher-led review until curriculum alignment is confirmed.`,
      weeks: fallbackWeeks,
      priorityTopics: [],
      teacherComments: 'Curriculum mapping pending. Use evidence and classroom observation to guide the bridge plan.',
      approved: false,
    }
  }

  const allTopics: Array<{ id: string; title: string; subject: string; status: 'unknown' | 'possible' }> = []

  comparisons.forEach((comparison) => {
    comparison.unknown.forEach((item) => allTopics.push({ id: item.topic.id, title: item.topic.title, subject: comparison.subject, status: 'unknown' }))
    comparison.possible.forEach((item) => allTopics.push({ id: item.topic.id, title: item.topic.title, subject: comparison.subject, status: 'possible' }))
  })

  const deduped = Object.values(
    allTopics.reduce<Record<string, { id: string; title: string; subject: string; status: 'unknown' | 'possible' }>>((acc, topic) => {
      acc[topic.id] = acc[topic.id] ?? topic
      return acc
    }, {})
  )

  const prioritized = deduped.sort((a, b) => {
    if (a.status === b.status) return a.subject.localeCompare(b.subject)
    return a.status === 'unknown' ? -1 : 1
  })

  const weekTopics = [prioritized.slice(0, 2), prioritized.slice(2, 4), prioritized.slice(4, 6), prioritized.slice(6, 8)]

  const weeks = Array.from({ length: 4 }, (_, index) => {
    const topics = weekTopics[index] ?? []
    const specificTopics = topics.length > 0 ? topics : [{ id: 'general', title: 'language and concept consolidation', subject: 'General', status: 'unknown' as const }]

    const objectives = specificTopics.map((topic) => {
      if (topic.id === 'general') {
        return 'Establish a reliable baseline in the language of instruction and build confidence in core classroom routines.'
      }
      return `Strengthen understanding of ${topic.title} in ${topic.subject} using familiar examples and simple explanations.`
    })

    const activities = specificTopics.map((topic) => {
      if (topic.id === 'general') {
        return 'Use bilingual glossaries, visual prompts and short oral check-ins to support confidence in class.'
      }
      if (topic.status === 'unknown') {
        return `Teacher-led explanation, vocabulary support and one guided task for ${topic.title}.`
      }
      return `Review and practice ${topic.title} with guided examples and paired discussion.`
    })

    const resources = specificTopics.map((topic) => {
      if (topic.id === 'general') return 'Bilingual vocabulary cards, concept posters, and oral recap prompts.'
      return `Local examples, short worksheets, and simple classroom tasks for ${topic.title}.`
    })

    const assessment = specificTopics[0]?.id === 'general'
      ? 'Exit ticket: one oral response plus one written or spoken explanation of the week’s focus.'
      : `Check for understanding through quick questions on ${specificTopics.map((topic) => topic.title).join(', ')}.`

    const outcome = specificTopics[0]?.id === 'general'
      ? 'The student should feel more confident in the new classroom environment and able to follow teaching language more reliably.'
      : `The student should show stronger understanding of ${specificTopics.map((topic) => topic.title).join(', ')} and be ready to build on the next topic.`

    return {
      week: index + 1,
      objectives: objectives.length ? objectives : [fallbackWeeks[index].objectives[0]],
      activities: activities.length ? activities : [fallbackWeeks[index].activities[0]],
      resources: resources.length ? resources : fallbackWeeks[index].resources,
      assessment,
      expectedOutcome: outcome,
    }
  })

  return {
    id: `plan-${caseData.id}-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    languageAdaptationNotes: `Preferred teaching language: ${caseData.preferredLanguage}. Use bilingual explanations, simple sentence frames and vocabulary support in the classroom.`,
    weeks,
    priorityTopics: prioritized.slice(0, 8).map((topic) => ({ id: topic.id, title: topic.title, description: `${topic.subject} transition focus` })),
    teacherComments: '',
    approved: false,
  }
}
