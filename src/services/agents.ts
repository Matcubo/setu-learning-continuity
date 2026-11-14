import { CurriculumComparison, TransitionCase } from '../types'
import { curricula } from '../data/curricula'

// Deterministic demo-mode agents

export function compareCurricula(caseData: TransitionCase): CurriculumComparison[]{
  const source = curricula.find(c=>c.id === caseData.sourceCurriculumId)
  const dest = curricula.find(c=>c.id === caseData.destinationCurriculumId)
  if(!source || !dest) return []

  const result: CurriculumComparison[] = []

  ;(Object.keys(dest.subjects) as Array<any>).forEach((subject)=>{
    const destTopics = dest.subjects[subject]
    const sourceTopics = source.subjects[subject] || []

    const confirmed = [] as any[]
    const possible = [] as any[]
    const unknown = [] as any[]

    destTopics.forEach(dt=>{
      const matched = sourceTopics.find(st=>st.id === dt.id)
      const evidence = caseData.evidence.filter(e=>e.subject === subject && e.topicId === dt.id)
      if(matched && evidence.length>0){
        confirmed.push({ topic: dt, evidenceFor: evidence, status: 'confirmed' })
      }else if(matched){
        possible.push({ topic: dt, evidenceFor: [], status: 'possible' })
      }else{
        unknown.push({ topic: dt, evidenceFor: [], status: 'unknown' })
      }
    })

    result.push({ subject, confirmed, possible, unknown })
  })

  return result
}

export function generateTransitionPlan(caseData: TransitionCase, comparisons: CurriculumComparison[]){
  // Build a focused 4-week plan using unknown/possible topics. Use evidence to create objectives and activities.
  const topics: any[] = []
  comparisons.forEach(comp=>{
    comp.possible.forEach(p=>topics.push({ ...p.topic, status: 'possible', subject: comp.subject }))
    comp.unknown.forEach(u=>topics.push({ ...u.topic, status: 'unknown', subject: comp.subject }))
  })

  // Deduplicate
  const byId: Record<string, any> = {}
  topics.forEach(t=>byId[t.id] = t)
  const unique = Object.values(byId)

  // Sort unknown first
  unique.sort((a,b)=> (a.status==='unknown'? -1:1))

  // Ensure up to 8 priority topics
  const priority = unique.slice(0,8)

  const weeks = [] as any[]
  const perWeek = Math.max(1, Math.ceil(priority.length/4))

  for(let w=1; w<=4; w++){
    const slice = priority.slice((w-1)*perWeek, w*perWeek)
    const objectives = slice.map(t=>{
      return `${t.subject}: Ensure understanding of '${t.title}' (clarify vocabulary and core concept)`
    })
    const activities = slice.map(t=>{
      if(t.status==='unknown') return `Activity: teacher-led demo, use local language examples for ${t.title}`
      return `Activity: short guided practice and paired work on ${t.title}`
    })
    const assessment = slice.length>0 ? `Checkpoint: quick formative questions on ${slice.map(s=>s.title).join(', ')}` : 'Checkpoint: class participation'
    weeks.push({ week: w, objectives, activities, assessment })
  }

  return {
    id: `plan-${caseData.id}-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    languageAdaptationNotes: `Preferred language: ${caseData.preferredLanguage}. Provide key vocabulary and bilingual labels where possible.`,
    weeks,
    priorityTopics: priority,
    teacherComments: '',
    approved: false
  }
}
