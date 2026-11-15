import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, FileText, PencilLine, Printer, Sparkles, Target } from 'lucide-react'
import { loadCases, saveCases } from '../services/storage'
import { compareCurricula, generateTransitionPlan } from '../services/agents'
import { curricula } from '../data/curricula'
import { CurriculumComparison, TransitionCase } from '../types'

const tabs = ['overview', 'evidence', 'curriculum', 'plan', 'review'] as const

type TabName = (typeof tabs)[number]

export default function StudentView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState<TransitionCase | null>(null)
  const [comparisons, setComparisons] = useState<CurriculumComparison[] | null>(null)
  const [activeTab, setActiveTab] = useState<TabName>('overview')
  const [editingPlan, setEditingPlan] = useState(false)
  const [newEvidence, setNewEvidence] = useState({
    subject: 'Mathematics',
    topicId: '',
    evidenceType: 'assessment' as 'assessment' | 'teacherObservation' | 'certificate',
    note: '',
  })

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

  const availableTopics = useMemo(() => {
    if (!caseData) return []

    const source = curricula.find((item) => item.id === caseData.sourceCurriculumId)
    const destination = curricula.find((item) => item.id === caseData.destinationCurriculumId)
    const map = new Map<string, { id: string; title: string; subject: string }>()

    ;[source, destination].forEach((curriculum) => {
      Object.entries(curriculum?.subjects ?? {}).forEach(([subject, topics]) => {
        topics.forEach((topic) => {
          map.set(`${subject}:${topic.id}`, { id: topic.id, title: topic.title, subject })
        })
      })
    })

    return Array.from(map.values())
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
    setActiveTab('plan')
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
    setActiveTab('review')
  }

  function reopenPlan() {
    if (!caseData || !caseData.plan) return
    const updated = {
      ...caseData,
      status: 'under_review' as const,
      plan: { ...caseData.plan, approved: false },
    }
    updateCase(updated)
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

    updateCase({
      ...caseData,
      plan: { ...caseData.plan, weeks: updatedWeeks },
    })
  }

  function addEvidence() {
    if (!caseData) return

    const topicId = newEvidence.topicId.trim()
    if (!topicId) return

    const entry = {
      subject: newEvidence.subject,
      topicId,
      evidenceType: newEvidence.evidenceType,
      note: newEvidence.note.trim(),
    }

    const exists = caseData.academicRecords.find((record) => record.subject === newEvidence.subject)
    const updatedAcademicRecords = exists
      ? caseData.academicRecords.map((record) =>
          record.subject === newEvidence.subject
            ? {
                ...record,
                completedTopicIds: record.completedTopicIds.includes(topicId)
                  ? record.completedTopicIds
                  : [...record.completedTopicIds, topicId],
                observations: record.observations || newEvidence.note.trim() || 'Evidence added during review',
              }
            : record
        )
      : [...caseData.academicRecords, { subject: newEvidence.subject, completedTopicIds: [topicId], observations: newEvidence.note.trim() || 'Evidence added during review' }]

    updateCase({
      ...caseData,
      evidence: [...caseData.evidence, entry],
      academicRecords: updatedAcademicRecords,
    })

    setNewEvidence({
      subject: 'Mathematics',
      topicId: '',
      evidenceType: 'assessment',
      note: '',
    })
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
          <div className="inline-note">
            {caseData.sourceState} ? {caseData.destinationState} • Class {caseData.currentClass}
          </div>
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
          {caseData.plan && caseData.plan.approved && (
            <button className="btn btn-secondary" onClick={reopenPlan}>
              Reopen review
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

      <div className="cta-row" style={{ marginBottom: '1.25rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
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
                <h2 className="section-title">Workflow progress</h2>
              </div>
              <div className="timeline">
                <div className="timeline-step">
                  <div style={{ fontWeight: 700 }}>Basic details</div>
                  <div className="inline-note">Completed for {caseData.studentName}</div>
                </div>
                <div className="timeline-step">
                  <div style={{ fontWeight: 700 }}>Curriculum match</div>
                  <div className="inline-note">{sourceCurr?.title} ? {destCurr?.title}</div>
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

          <section className="section-card card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target size={18} color="#0a8f8d" />
              <h2 className="section-title">Academic records</h2>
            </div>
            {caseData.academicRecords.length === 0 ? (
              <div className="empty-state">No academic record has been added yet.</div>
            ) : (
              <div className="timeline">
                {caseData.academicRecords.map((record) => (
                  <div key={record.subject} className="timeline-step">
                    <div style={{ fontWeight: 700 }}>{record.subject}</div>
                    <div className="inline-note">
                      Completed topics: {record.completedTopicIds.length ? record.completedTopicIds.join(', ') : 'No topic list recorded'}
                    </div>
                    {record.observations && <div className="inline-note" style={{ marginTop: '0.35rem' }}>{record.observations}</div>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === 'evidence' && (
        <section className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <PencilLine size={18} color="#0a8f8d" />
            <h2 className="section-title">Evidence log</h2>
          </div>

          <div className="list-card" style={{ marginBottom: '1.25rem' }}>
            <div className="form-grid">
              <div>
                <label className="label">Subject</label>
                <select
                  className="select"
                  value={newEvidence.subject}
                  onChange={(event) => setNewEvidence((current) => ({ ...current, subject: event.target.value }))}
                >
                  {availableTopics.length > 0 ? (
                    [...new Set(availableTopics.map((topic) => topic.subject))].map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))
                  ) : (
                    <option value="Mathematics">Mathematics</option>
                  )}
                </select>
              </div>
              <div>
                <label className="label">Topic ID</label>
                <input
                  className="input"
                  value={newEvidence.topicId}
                  onChange={(event) => setNewEvidence((current) => ({ ...current, topicId: event.target.value }))}
                  placeholder="e.g. m-num-fractions"
                />
              </div>
              <div>
                <label className="label">Evidence type</label>
                <select
                  className="select"
                  value={newEvidence.evidenceType}
                  onChange={(event) =>
                    setNewEvidence((current) => ({
                      ...current,
                      evidenceType: event.target.value as 'assessment' | 'teacherObservation' | 'certificate',
                    }))
                  }
                >
                  <option value="assessment">Assessment</option>
                  <option value="teacherObservation">Teacher observation</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>
              <div>
                <label className="label">Evidence note</label>
                <input
                  className="input"
                  value={newEvidence.note}
                  onChange={(event) => setNewEvidence((current) => ({ ...current, note: event.target.value }))}
                  placeholder="Describe outcome or context"
                />
              </div>
            </div>
            <div className="cta-row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" type="button" onClick={addEvidence}>
                Add evidence
              </button>
            </div>
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
      )}

      {activeTab === 'curriculum' && (
        <section className="section-card card-body">
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
                      {comparison.confirmed.length > 0 ? (
                        comparison.confirmed.map((match) => (
                          <div key={match.topic.id} className="list-card" style={{ marginTop: '0.5rem' }}>
                            <div style={{ fontWeight: 700 }}>{match.topic.title}</div>
                            <div className="inline-note">{match.explanation}</div>
                          </div>
                        ))
                      ) : (
                        <div className="inline-note" style={{ marginTop: '0.5rem' }}>No confirmed topics for this subject.</div>
                      )}
                    </div>
                    <div>
                      <div className="inline-note" style={{ color: '#b45309', fontWeight: 700 }}>Potential learning gap</div>
                      {comparison.possible.length > 0 ? (
                        comparison.possible.map((match) => (
                          <div key={match.topic.id} className="list-card" style={{ marginTop: '0.5rem' }}>
                            <div style={{ fontWeight: 700 }}>{match.topic.title}</div>
                            <div className="inline-note">{match.explanation}</div>
                          </div>
                        ))
                      ) : (
                        <div className="inline-note" style={{ marginTop: '0.5rem' }}>No likely gaps identified.</div>
                      )}
                    </div>
                    <div>
                      <div className="inline-note" style={{ color: '#b42318', fontWeight: 700 }}>Unknown</div>
                      {comparison.unknown.length > 0 ? (
                        comparison.unknown.map((match) => (
                          <div key={match.topic.id} className="list-card" style={{ marginTop: '0.5rem' }}>
                            <div style={{ fontWeight: 700 }}>{match.topic.title}</div>
                            <div className="inline-note">{match.explanation}</div>
                          </div>
                        ))
                      ) : (
                        <div className="inline-note" style={{ marginTop: '0.5rem' }}>No unknown topics flagged.</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Comparing curricula...</div>
          )}
        </section>
      )}

      {activeTab === 'plan' && (
        <section className="section-card card-body">
          {!caseData.plan ? (
            <div className="empty-state">No bridge plan has been generated yet. Create one from the overview tab.</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <div className="page-kicker" style={{ marginBottom: '0.35rem' }}>Bridge plan</div>
                  <h2 className="section-title">Four-week learning bridge</h2>
                </div>
                {!caseData.plan.approved && (
                  <button className="btn btn-ghost" onClick={() => setEditingPlan((value) => !value)}>
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
            </>
          )}
        </section>
      )}

      {activeTab === 'review' && (
        <section className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={18} color="#0a8f8d" />
            <h2 className="section-title">Teacher review</h2>
          </div>

          <div className="form-grid">
            <div className="list-card">
              <div className="inline-note">Status</div>
              <div style={{ fontWeight: 800, marginTop: '0.35rem' }}>{caseData.status === 'approved' ? 'Approved' : caseData.status === 'under_review' ? 'Assessment pending' : 'New case'}</div>
            </div>
            <div className="list-card">
              <div className="inline-note">Plan status</div>
              <div style={{ fontWeight: 800, marginTop: '0.35rem' }}>{caseData.plan ? (caseData.plan.approved ? 'Approved' : 'In progress') : 'Not generated'}</div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label className="label">Teacher notes</label>
            <textarea
              className="textarea"
              rows={6}
              value={caseData.teacherNotes ?? ''}
              onChange={(event) => updateCase({ ...caseData, teacherNotes: event.target.value })}
              placeholder="Document the final recommendation, review notes, and implementation priorities."
            />
          </div>

          <div className="cta-row" style={{ marginTop: '1.25rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" type="button" onClick={() => updateCase({ ...caseData, status: 'under_review' as const })}>
              Move to assessment
            </button>
            {caseData.plan && (
              <button className="btn btn-warm" type="button" onClick={approvePlan}>
                Approve transition
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
