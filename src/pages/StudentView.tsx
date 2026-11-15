import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, FileText, PencilLine, Printer, Sparkles, Target } from 'lucide-react'
import { loadCases, saveCases } from '../services/storage'
import { compareCurricula, generateTransitionPlan } from '../services/agents'
import { curricula } from '../data/curricula'
import { CurriculumComparison, TransitionCase } from '../types'

export default function StudentView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState<TransitionCase | null>(null)
  const [comparisons, setComparisons] = useState<CurriculumComparison[] | null>(null)
  const [editingPlan, setEditingPlan] = useState(false)

  useEffect(() => {
    const cases = loadCases()
    const found = cases.find((item) => item.id === id)
    if (!found) return navigate('/students')
    setCaseData(found)
  }, [id, navigate])

  useEffect(() => {
    if (!caseData) return
    setComparisons(compareCurricula(caseData))
  }, [caseData])

  function updateCase(next: TransitionCase) {
    const all = loadCases()
    const remaining = all.filter((item) => item.id !== next.id)
    saveCases([next, ...remaining])
    setCaseData(next)
  }

  function generatePlan() {
    if (!caseData || !comparisons) return
    const plan = generateTransitionPlan(caseData, comparisons)
    const updated = { ...caseData, status: 'under_review' as const, plan }
    updateCase(updated)
  }

  function approvePlan() {
    if (!caseData || !caseData.plan) return
    const updated = {
      ...caseData,
      status: 'approved' as const,
      plan: { ...caseData.plan, approved: true },
    }
    updateCase(updated)
    setEditingPlan(false)
  }

  function updateWeek(
    weekNum: number,
    field: 'objectives' | 'activities' | 'resources' | 'assessment' | 'expectedOutcome',
    value: string[]
  ) {
    if (!caseData?.plan) return
    const updatedWeeks = caseData.plan.weeks.map((week) => {
      if (week.week !== weekNum) return week
      return { ...week, [field]: value }
    })
    updateCase({ ...caseData, plan: { ...caseData.plan, weeks: updatedWeeks } })
  }

  if (!caseData) {
    return (
      <div className="page">
        <div className="section-card card-body">Loading student record...</div>
      </div>
    )
  }

  const sourceCurr = curricula.find((item) => item.id === caseData.sourceCurriculumId)
  const destCurr = curricula.find((item) => item.id === caseData.destinationCurriculumId)

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="page-kicker">Student workspace</div>
          <h1 className="page-title">{caseData.studentName}</h1>
          <div className="inline-note">{caseData.sourceState} → {caseData.destinationState} • Class {caseData.currentClass}</div>
        </div>
        <div className="cta-row">
          <Link to="/students" className="btn btn-ghost">
            <ArrowLeft size={16} />
            Back
          </Link>
          {!caseData.plan && (
            <button className="btn btn-primary" onClick={generatePlan}>
              <Target size={16} />
              Generate 4-week plan
            </button>
          )}
          {caseData.plan && !caseData.plan.approved && (
            <button className="btn btn-warm" onClick={approvePlan}>
              <CheckCircle2 size={16} />
              Approve plan
            </button>
          )}
          {caseData.plan && (
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={16} />
              Print
            </button>
          )}
        </div>
      </header>

      <div className="risk-grid" style={{ marginBottom: '1.5rem' }}>
        <section className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FileText size={18} color="#0a8f8d" />
            <h2 className="section-title">Student overview</h2>
          </div>

          <div className="form-grid">
            <div className="list-card">
              <div className="inline-note">Source curriculum</div>
              <div style={{ fontWeight: 700 }}>{sourceCurr?.title ?? 'Unknown source'}</div>
            </div>
            <div className="list-card">
              <div className="inline-note">Destination curriculum</div>
              <div style={{ fontWeight: 700 }}>{destCurr?.title ?? 'Unknown destination'}</div>
            </div>
            <div className="list-card">
              <div className="inline-note">Previous language</div>
              <div style={{ fontWeight: 700 }}>{caseData.previousLanguage}</div>
            </div>
            <div className="list-card">
              <div className="inline-note">Preferred language</div>
              <div style={{ fontWeight: 700 }}>{caseData.preferredLanguage}</div>
            </div>
          </div>
        </section>

        <section className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={18} color="#0a8f8d" />
            <h2 className="section-title">Progress across workflow</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Basic details</div>
              <div className="inline-note">Completed for {caseData.studentName}</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Curriculum match</div>
              <div className="inline-note">{sourceCurr?.title} → {destCurr?.title}</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Academic evidence</div>
              <div className="inline-note">{caseData.evidence.length} evidence entries recorded</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Learning plan</div>
              <div className="inline-note">{caseData.plan ? 'Generated and ready for review' : 'Not generated yet'}</div>
            </div>
          </div>
        </section>
      </div>

      <div className="risk-grid" style={{ marginBottom: '1.5rem' }}>
        <section className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Target size={18} color="#0a8f8d" />
            <h2 className="section-title">Academic evidence</h2>
          </div>
          {caseData.academicRecords.length === 0 ? (
            <div className="empty-state">No academic record has been added yet.</div>
          ) : (
            <div className="timeline">
              {caseData.academicRecords.map((record) => (
                <div key={record.subject} className="timeline-step">
                  <div style={{ fontWeight: 700 }}>{record.subject}</div>
                  <div className="inline-note">Completed topics: {record.completedTopicIds.length ? record.completedTopicIds.join(', ') : 'No topic list recorded'}</div>
                  {record.observations && <div className="inline-note" style={{ marginTop: '0.35rem' }}>{record.observations}</div>}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <PencilLine size={18} color="#0a8f8d" />
            <h2 className="section-title">Evidence log</h2>
          </div>
          {caseData.evidence.length === 0 ? (
            <div className="empty-state">No evidence has been added for this student yet.</div>
          ) : (
            <div className="timeline">
              {caseData.evidence.map((entry, index) => (
                <div key={`${entry.subject}-${entry.topicId}-${index}`} className="timeline-step">
                  <div style={{ fontWeight: 700 }}>{entry.subject}</div>
                  <div className="inline-note">{entry.topicId} • {entry.evidenceType}</div>
                  {entry.note && <div className="inline-note" style={{ marginTop: '0.35rem' }}>{entry.note}</div>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="section-card card-body" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={18} color="#0a8f8d" />
          <h2 className="section-title">Curriculum comparison</h2>
        </div>
        {comparisons && comparisons.length > 0 ? (
          <div className="timeline">
            {comparisons.map((comparison) => (
              <div key={comparison.subject} className="timeline-step">
                <div style={{ fontWeight: 700 }}>{comparison.subject}</div>
                <div className="form-grid" style={{ marginTop: '0.8rem' }}>
                  <div>
                    <div className="inline-note" style={{ color: '#087f5b', fontWeight: 700 }}>Evidence-supported</div>
                    {comparison.confirmed.length > 0 ? comparison.confirmed.map((match) => (
                      <div key={match.topic.id} className="list-card" style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontWeight: 700 }}>{match.topic.title}</div>
                        <div className="inline-note">{match.explanation}</div>
                      </div>
                    )) : <div className="inline-note" style={{ marginTop: '0.5rem' }}>No confirmed topics for this subject.</div>}
                  </div>
                  <div>
                    <div className="inline-note" style={{ color: '#b45309', fontWeight: 700 }}>Potential learning gap</div>
                    {comparison.possible.length > 0 ? comparison.possible.map((match) => (
                      <div key={match.topic.id} className="list-card" style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontWeight: 700 }}>{match.topic.title}</div>
                        <div className="inline-note">{match.explanation}</div>
                      </div>
                    )) : <div className="inline-note" style={{ marginTop: '0.5rem' }}>No likely gaps identified.</div>}
                  </div>
                  <div>
                    <div className="inline-note" style={{ color: '#b42318', fontWeight: 700 }}>Not assessed / Unknown</div>
                    {comparison.unknown.length > 0 ? comparison.unknown.map((match) => (
                      <div key={match.topic.id} className="list-card" style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontWeight: 700 }}>{match.topic.title}</div>
                        <div className="inline-note">{match.explanation}</div>
                      </div>
                    )) : <div className="inline-note" style={{ marginTop: '0.5rem' }}>No unknown topics flagged.</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Comparing curricula...</div>
        )}
      </section>

      {caseData.plan && (
        <section className="section-card card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div className="page-kicker" style={{ marginBottom: '0.35rem' }}>Bridge plan</div>
              <h2 className="section-title">Four-week learning bridge</h2>
            </div>
            {!caseData.plan.approved && (
              <button className="btn btn-ghost" onClick={() => setEditingPlan(!editingPlan)}>
                <PencilLine size={15} />
                {editingPlan ? 'Close edit' : 'Edit plan'}
              </button>
            )}
          </div>

          <div className="inline-note" style={{ marginTop: '0.7rem' }}>{caseData.plan.languageAdaptationNotes}</div>

          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.9rem' }}>
            {caseData.plan.weeks.map((week) => (
              <div key={week.week} className="list-card">
                <div style={{ fontWeight: 800, marginBottom: '0.65rem' }}>Week {week.week}</div>
                {editingPlan ? (
                  <div className="form-grid">
                    <div>
                      <label className="label">Objectives</label>
                      <textarea className="textarea" rows={4} value={week.objectives.join('\n')} onChange={(event) => updateWeek(week.week, 'objectives', event.target.value.split('\n'))} />
                    </div>
                    <div>
                      <label className="label">Activities</label>
                      <textarea className="textarea" rows={4} value={week.activities.join('\n')} onChange={(event) => updateWeek(week.week, 'activities', event.target.value.split('\n'))} />
                    </div>
                    <div>
                      <label className="label">Resources</label>
                      <textarea className="textarea" rows={4} value={week.resources.join('\n')} onChange={(event) => updateWeek(week.week, 'resources', event.target.value.split('\n'))} />
                    </div>
                    <div>
                      <label className="label">Assessment</label>
                      <textarea className="textarea" rows={4} value={week.assessment} onChange={(event) => updateWeek(week.week, 'assessment', [event.target.value])} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="label">Expected outcome</label>
                      <textarea className="textarea" rows={3} value={week.expectedOutcome} onChange={(event) => updateWeek(week.week, 'expectedOutcome', [event.target.value])} />
                    </div>
                  </div>
                ) : (
                  <div className="form-grid">
                    <div>
                      <div className="inline-note" style={{ fontWeight: 700, color: '#0b2545' }}>Objectives</div>
                      <ul style={{ paddingLeft: '1.1rem', marginTop: '0.45rem' }}>
                        {week.objectives.map((objective) => <li key={objective}>{objective}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="inline-note" style={{ fontWeight: 700, color: '#0b2545' }}>Activities</div>
                      <ul style={{ paddingLeft: '1.1rem', marginTop: '0.45rem' }}>
                        {week.activities.map((activity) => <li key={activity}>{activity}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="inline-note" style={{ fontWeight: 700, color: '#0b2545' }}>Resources</div>
                      <ul style={{ paddingLeft: '1.1rem', marginTop: '0.45rem' }}>
                        {week.resources.map((resource) => <li key={resource}>{resource}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="inline-note" style={{ fontWeight: 700, color: '#0b2545' }}>Assessment</div>
                      <div style={{ marginTop: '0.45rem' }}>{week.assessment}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div className="inline-note" style={{ fontWeight: 700, color: '#0b2545' }}>Expected outcome</div>
                      <div style={{ marginTop: '0.45rem' }}>{week.expectedOutcome}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
