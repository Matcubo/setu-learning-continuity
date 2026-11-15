import { CurriculumComparison, TransitionCase } from '../types'
import { curricula } from '../data/curricula'

const subjectOrder = ['Mathematics', 'Science'] as const

export function compareCurricula(caseData: TransitionCase): CurriculumComparison[] {
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

  const fallbackWeeks = [
    'Baseline listening, reading and numeracy checks to establish the start point.',
    'Targeted bridge work on priority vocabulary and core concepts.',
    'Guided practice with repetition, examples and peer correction.',
    'Review and consolidation with a simple exit assessment and next-step notes.'
  ]

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

    const subjectSummary = specificTopics.map((topic) => topic.subject).join(', ')
    const assessment = specificTopics[0]?.id === 'general'
      ? 'Exit ticket: one oral response plus one written or spoken explanation of the week’s focus.'
      : `Check for understanding through quick questions on ${specificTopics.map((topic) => topic.title).join(', ')}.`

    const outcome = specificTopics[0]?.id === 'general'
      ? 'The student should feel more confident in the new classroom environment and able to follow teaching language more reliably.'
      : `The student should show stronger understanding of ${specificTopics.map((topic) => topic.title).join(', ')} and be ready to build on the next topic.`

    return {
      week: index + 1,
      objectives: objectives.length ? objectives : [fallbackWeeks[index]],
      activities: activities.length ? activities : [fallbackWeeks[index]],
      resources: resources.length ? resources : ['Visual examples', 'Teacher guided practice', 'Short recap task'],
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
