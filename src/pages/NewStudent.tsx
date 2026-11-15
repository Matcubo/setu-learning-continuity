import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react'
import { TransitionCase } from '../types'
import { loadCases, saveCases } from '../services/storage'
import { allStateOptions, boardOptions, getCurriculumOptionsForState, getDefaultCurriculumForState, gradeOptions, languageOptions, schoolStageOptions } from '../data/curricula'

const wizardSteps = ['Profile', 'Academic context', 'Curriculum match', 'Review']

const defaultForm = {
  studentName: '',
  currentClass: '6',
  schoolStage: 'Middle',
  board: 'state-board',
  sourceState: 'Bihar',
  destinationState: 'Gujarat',
  previousLanguage: 'Hindi',
  preferredLanguage: 'Gujarati',
  sourceCurriculumId: 'bihar-class6-std',
  destinationCurriculumId: 'gujarat-class6-std',
  evidenceSummary: '',
  teacherNotes: '',
}

export default function NewStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState<string[]>([])
  const [step, setStep] = useState(0)
  const [sourceQuery, setSourceQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')

  const sourceOptions = useMemo(
    () => allStateOptions.filter((state) => state.name.toLowerCase().includes(sourceQuery.trim().toLowerCase())),
    [sourceQuery]
  )

  const destinationOptions = useMemo(
    () => allStateOptions.filter((state) => state.name.toLowerCase().includes(destinationQuery.trim().toLowerCase())),
    [destinationQuery]
  )

  const sourceCurricula = useMemo(
    () => getCurriculumOptionsForState(form.sourceState, form.currentClass, form.board),
    [form.sourceState, form.currentClass, form.board]
  )

  const destinationCurricula = useMemo(
    () => getCurriculumOptionsForState(form.destinationState, form.currentClass, form.board),
    [form.destinationState, form.currentClass, form.board]
  )

  function syncCurriculumSelections(next: typeof defaultForm) {
    const sourceOptions = getCurriculumOptionsForState(next.sourceState, next.currentClass, next.board)
    const destinationOptions = getCurriculumOptionsForState(next.destinationState, next.currentClass, next.board)

    next.sourceCurriculumId = sourceOptions.some((curriculum) => curriculum.id === next.sourceCurriculumId)
      ? next.sourceCurriculumId
      : sourceOptions[0]?.id ?? null

    next.destinationCurriculumId = destinationOptions.some((curriculum) => curriculum.id === next.destinationCurriculumId)
      ? next.destinationCurriculumId
      : destinationOptions[0]?.id ?? null
  }

  function updateField(field: string, value: string) {
    setForm((previous) => {
      const next = { ...previous, [field]: value }

      if (field === 'currentClass' || field === 'sourceState' || field === 'destinationState' || field === 'board') {
        syncCurriculumSelections(next)
      }

      return next
    })
  }

  function validateStep() {
    const nextErrors: string[] = []

    if (step === 0) {
      if (!form.studentName.trim()) nextErrors.push('Student name is required.')
      if (!form.currentClass.trim()) nextErrors.push('Class is required.')
      if (!form.schoolStage.trim()) nextErrors.push('School stage is required.')
      if (!form.board.trim()) nextErrors.push('Board is required.')
    }

    if (step === 1) {
      if (!form.previousLanguage.trim()) nextErrors.push('Previous language is required.')
      if (!form.preferredLanguage.trim()) nextErrors.push('Preferred language is required.')
      if (!form.evidenceSummary.trim()) nextErrors.push('Add a brief academic evidence summary.')
    }

    if (step === 2) {
      if (!form.sourceState.trim()) nextErrors.push('Source state is required.')
      if (!form.destinationState.trim()) nextErrors.push('Destination state is required.')

      const sourceOptions = getCurriculumOptionsForState(form.sourceState, form.currentClass, form.board)
      const destinationOptions = getCurriculumOptionsForState(form.destinationState, form.currentClass, form.board)

      if (sourceOptions.length > 0 && !form.sourceCurriculumId) {
        nextErrors.push('Select a source curriculum.')
      }
      if (destinationOptions.length > 0 && !form.destinationCurriculumId) {
        nextErrors.push('Select a destination curriculum.')
      }
      if (sourceOptions.length > 0 && !sourceOptions.some((curriculum) => curriculum.id === form.sourceCurriculumId)) {
        nextErrors.push('The selected source curriculum is not available for the chosen state and class.')
      }
      if (destinationOptions.length > 0 && !destinationOptions.some((curriculum) => curriculum.id === form.destinationCurriculumId)) {
        nextErrors.push('The selected destination curriculum is not available for the chosen state and class.')
      }
    }

    setErrors(nextErrors)
    return nextErrors.length === 0
  }

  function nextStep() {
    if (!validateStep()) return
    setStep((current) => Math.min(current + 1, wizardSteps.length - 1))
    setErrors([])
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 0))
    setErrors([])
  }

  function create() {
    const nextErrors: string[] = []
    if (!form.studentName.trim()) nextErrors.push('Student name is required.')
    if (!form.currentClass.trim()) nextErrors.push('Class is required.')
    if (!form.previousLanguage.trim()) nextErrors.push('Previous language is required.')
    if (!form.preferredLanguage.trim()) nextErrors.push('Preferred language is required.')
    if (!form.sourceState.trim()) nextErrors.push('Source state is required.')
    if (!form.destinationState.trim()) nextErrors.push('Destination state is required.')
    if (!form.evidenceSummary.trim()) nextErrors.push('Add a brief academic evidence summary.')

    const sourceOptions = getCurriculumOptionsForState(form.sourceState, form.currentClass, form.board)
    const destinationOptions = getCurriculumOptionsForState(form.destinationState, form.currentClass, form.board)

    if (sourceOptions.length > 0 && !form.sourceCurriculumId) {
      nextErrors.push('Select a source curriculum.')
    }
    if (destinationOptions.length > 0 && !form.destinationCurriculumId) {
      nextErrors.push('Select a destination curriculum.')
    }
    if (sourceOptions.length > 0 && !sourceOptions.some((curriculum) => curriculum.id === form.sourceCurriculumId)) {
      nextErrors.push('The selected source curriculum is not available for the chosen state and class.')
    }
    if (destinationOptions.length > 0 && !destinationOptions.some((curriculum) => curriculum.id === form.destinationCurriculumId)) {
      nextErrors.push('The selected destination curriculum is not available for the chosen state and class.')
    }

    setErrors(nextErrors)
    if (nextErrors.length > 0) return

    const all = loadCases()
    const id = `case-${Date.now()}`
    const next: TransitionCase = {
      id,
      studentName: form.studentName.trim(),
      currentClass: form.currentClass.trim(),
      sourceState: form.sourceState,
      destinationState: form.destinationState,
      previousLanguage: form.previousLanguage.trim(),
      preferredLanguage: form.preferredLanguage.trim(),
      sourceCurriculumId: sourceOptions.length > 0 ? form.sourceCurriculumId ?? null : null,
      destinationCurriculumId: destinationOptions.length > 0 ? form.destinationCurriculumId ?? null : null,
      academicRecords: [
        { subject: 'Mathematics', completedTopicIds: [], observations: form.evidenceSummary.trim() },
        { subject: 'Science', completedTopicIds: [], observations: '' },
      ],
      evidence: [],
      teacherNotes: form.teacherNotes.trim(),
      status: 'new',
      createdAt: new Date().toISOString(),
      schoolStage: form.schoolStage,
      board: form.board,
      grade: form.currentClass,
    }

    saveCases([next, ...all])
    navigate(`/students/${id}`)
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="page-kicker">Create case</div>
          <h1 className="page-title">New student transition</h1>
        </div>
        <Link to="/students" className="btn btn-ghost">
          <ArrowLeft size={16} />
          Back to cases
        </Link>
      </header>

      <section className="section-card card-body">
        <div className="wizard-progress" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {wizardSteps.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`btn ${index === step ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStep(index)}
              style={{ justifyContent: 'center' }}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="form-grid">
            <div>
              <label className="label">Student name</label>
              <input className="input" value={form.studentName} onChange={(event) => updateField('studentName', event.target.value)} placeholder="e.g. Asha, demo student" />
            </div>
            <div>
              <label className="label">Grade / class</label>
              <select className="select" value={form.currentClass} onChange={(event) => updateField('currentClass', event.target.value)}>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>Class {grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">School stage</label>
              <select className="select" value={form.schoolStage} onChange={(event) => updateField('schoolStage', event.target.value)}>
                {schoolStageOptions.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Board</label>
              <select className="select" value={form.board} onChange={(event) => updateField('board', event.target.value)}>
                {boardOptions.map((board) => (
                  <option key={board.id} value={board.id}>{board.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="form-grid">
            <div>
              <label className="label">Previous teaching language</label>
              <select className="select" value={form.previousLanguage} onChange={(event) => updateField('previousLanguage', event.target.value)}>
                {languageOptions.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Preferred language</label>
              <select className="select" value={form.preferredLanguage} onChange={(event) => updateField('preferredLanguage', event.target.value)}>
                {languageOptions.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Academic evidence summary</label>
              <textarea className="textarea" rows={5} value={form.evidenceSummary} onChange={(event) => updateField('evidenceSummary', event.target.value)} placeholder="Add note on prior learning, assessment scores, class performance, and support needs." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-grid">
            <div>
              <label className="label">Source state / UT</label>
              <input className="input" value={sourceQuery} onChange={(event) => setSourceQuery(event.target.value)} placeholder="Search state or UT" style={{ marginBottom: '0.5rem' }} />
              <select className="select" value={form.sourceState} onChange={(event) => updateField('sourceState', event.target.value)}>
                {sourceOptions.map((state) => (
                  <option key={state.id} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Destination state / UT</label>
              <input className="input" value={destinationQuery} onChange={(event) => setDestinationQuery(event.target.value)} placeholder="Search destination state" style={{ marginBottom: '0.5rem' }} />
              <select className="select" value={form.destinationState} onChange={(event) => updateField('destinationState', event.target.value)}>
                {destinationOptions.map((state) => (
                  <option key={state.id} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Source curriculum</label>
              {sourceCurricula.length === 0 ? (
                <div className="inline-note" style={{ marginBottom: '0.55rem', color: '#8a5b00' }}>Curriculum data unavailable — you can still create this case.</div>
              ) : null}
              <select className="select" value={form.sourceCurriculumId ?? ''} onChange={(event) => updateField('sourceCurriculumId', event.target.value || '')}>
                {sourceCurricula.length === 0 ? (
                  <option value="">No curriculum available</option>
                ) : (
                  sourceCurricula.map((curriculum) => (
                    <option key={curriculum.id} value={curriculum.id}>{curriculum.title}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="label">Destination curriculum</label>
              {destinationCurricula.length === 0 ? (
                <div className="inline-note" style={{ marginBottom: '0.55rem', color: '#8a5b00' }}>Curriculum data unavailable — you can still create this case.</div>
              ) : null}
              <select className="select" value={form.destinationCurriculumId ?? ''} onChange={(event) => updateField('destinationCurriculumId', event.target.value || '')}>
                {destinationCurricula.length === 0 ? (
                  <option value="">No curriculum available</option>
                ) : (
                  destinationCurricula.map((curriculum) => (
                    <option key={curriculum.id} value={curriculum.id}>{curriculum.title}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-grid">
            <div className="list-card" style={{ gridColumn: '1 / -1' }}>
              <div className="inline-note">Student profile</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '0.35rem' }}>{form.studentName || 'Student name pending'}</div>
              <div style={{ marginTop: '0.5rem' }}>Class {form.currentClass} � {form.schoolStage} � {boardOptions.find((board) => board.id === form.board)?.name}</div>
              <div style={{ marginTop: '0.35rem' }}>{form.sourceState} → {form.destinationState}</div>
              <div style={{ marginTop: '0.35rem' }}>{form.previousLanguage} → {form.preferredLanguage}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Teacher notes</label>
              <textarea className="textarea" rows={4} value={form.teacherNotes} onChange={(event) => updateField('teacherNotes', event.target.value)} placeholder="Add notes for the receiving school, academic coordinator, or transition lead." />
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="validation-box" style={{ marginTop: '1.25rem', background: 'rgba(230, 57, 70, 0.06)', border: '1px solid rgba(230,57,70,0.12)', padding: '0.9rem 1rem', borderRadius: '12px' }}>
            <div style={{ fontWeight: 800, color: '#8d1e2d', marginBottom: '0.35rem' }}>Fix these before continuing</div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        )}

        <div className="cta-row" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          {step > 0 && (
            <button className="btn btn-ghost" type="button" onClick={previousStep}>
              Back
            </button>
          )}
          {step < wizardSteps.length - 1 ? (
            <button className="btn btn-primary" type="button" onClick={nextStep}>
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" type="button" onClick={create}>
              <Plus size={15} />
              Create transition case
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
