import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Compass, FileText, Plus } from 'lucide-react'
import { TransitionCase } from '../types'
import { loadCases, saveCases } from '../services/storage'
import { allStateOptions, boardOptions, curricula, gradeOptions, languageOptions, schoolStageOptions } from '../data/curricula'

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
}

export default function NewStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState<string[]>([])
  const [sourceQuery, setSourceQuery] = useState('')
  const [destinationQuery, setDestinationQuery] = useState('')

  const filterableCurricula = useMemo(() => {
    const sourceCurricula = curricula.filter(
      (curriculum) => curriculum.state === form.sourceState && curriculum.grade === form.currentClass
    )
    const destinationCurricula = curricula.filter(
      (curriculum) => curriculum.state === form.destinationState && curriculum.grade === form.currentClass
    )
    return { sourceCurricula, destinationCurricula }
  }, [form.sourceState, form.destinationState, form.currentClass])

  const filteredSourceStates = useMemo(
    () => allStateOptions.filter((state) => state.name.toLowerCase().includes(sourceQuery.trim().toLowerCase())),
    [sourceQuery]
  )

  const filteredDestinationStates = useMemo(
    () => allStateOptions.filter((state) => state.name.toLowerCase().includes(destinationQuery.trim().toLowerCase())),
    [destinationQuery]
  )

  function updateField(field: string, value: string) {
    setForm((previous) => {
      const next = { ...previous, [field]: value }

      if (field === 'currentClass') {
        const sourceCurricula = curricula.filter((curriculum) => curriculum.state === previous.sourceState && curriculum.grade === value)
        const destinationCurricula = curricula.filter((curriculum) => curriculum.state === previous.destinationState && curriculum.grade === value)
        next.sourceCurriculumId = sourceCurricula[0]?.id ?? ''
        next.destinationCurriculumId = destinationCurricula[0]?.id ?? ''
      }

      if (field === 'sourceState') {
        const selectedSource = curricula.filter((curriculum) => curriculum.state === value && curriculum.grade === previous.currentClass)
        next.sourceCurriculumId = selectedSource[0]?.id ?? ''
      }

      if (field === 'destinationState') {
        const selectedDestination = curricula.filter((curriculum) => curriculum.state === value && curriculum.grade === previous.currentClass)
        next.destinationCurriculumId = selectedDestination[0]?.id ?? ''
      }

      return next
    })
  }

  function validate() {
    const nextErrors: string[] = []
    if (!form.studentName.trim()) nextErrors.push('Student name is required.')
    if (!form.currentClass.trim()) nextErrors.push('Class or grade is required.')
    if (!form.previousLanguage.trim()) nextErrors.push('Previous teaching language is required.')
    if (!form.preferredLanguage.trim()) nextErrors.push('Preferred teaching language is required.')
    if (!form.sourceState.trim()) nextErrors.push('Select a source state or union territory.')
    if (!form.destinationState.trim()) nextErrors.push('Select a destination state or union territory.')
    if (!form.sourceCurriculumId) nextErrors.push('Select a source curriculum.')
    if (!form.destinationCurriculumId) nextErrors.push('Select a destination curriculum.')
    return nextErrors
  }

  function create() {
    const nextErrors = validate()
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
      sourceCurriculumId: form.sourceCurriculumId,
      destinationCurriculumId: form.destinationCurriculumId,
      academicRecords: [
        { subject: 'Mathematics', completedTopicIds: [], observations: '' },
        { subject: 'Science', completedTopicIds: [], observations: '' },
      ],
      evidence: [],
      teacherNotes: '',
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
        <div className="risk-grid">
          <div className="section-card card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FileText size={18} color="#0a8f8d" />
              <h2 className="section-title">Student profile</h2>
            </div>
            <div className="form-grid">
              <div>
                <label className="label">Student identifier</label>
                <input className="input" value={form.studentName} onChange={(event) => updateField('studentName', event.target.value)} placeholder="e.g. Asha, demo student or fictional ID" />
              </div>
              <div>
                <label className="label">Class / Grade</label>
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
                <label className="label">Board / curriculum type</label>
                <select className="select" value={form.board} onChange={(event) => updateField('board', event.target.value)}>
                  {boardOptions.map((board) => (
                    <option key={board.id} value={board.id}>{board.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Previous teaching language</label>
                <select className="select" value={form.previousLanguage} onChange={(event) => updateField('previousLanguage', event.target.value)}>
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Preferred teaching language</label>
                <select className="select" value={form.preferredLanguage} onChange={(event) => updateField('preferredLanguage', event.target.value)}>
                  {languageOptions.map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="section-card card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Compass size={18} color="#0a8f8d" />
              <h2 className="section-title">State and curriculum</h2>
            </div>
            <div className="form-grid">
              <div>
                <label className="label">Source state / UT</label>
                <input
                  className="input"
                  value={sourceQuery}
                  onChange={(event) => setSourceQuery(event.target.value)}
                  placeholder="Search source state"
                  style={{ marginBottom: '0.6rem' }}
                />
                <select className="select" value={form.sourceState} onChange={(event) => updateField('sourceState', event.target.value)}>
                  {filteredSourceStates.map((state) => (
                    <option key={state.id} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Destination state / UT</label>
                <input
                  className="input"
                  value={destinationQuery}
                  onChange={(event) => setDestinationQuery(event.target.value)}
                  placeholder="Search destination state"
                  style={{ marginBottom: '0.6rem' }}
                />
                <select className="select" value={form.destinationState} onChange={(event) => updateField('destinationState', event.target.value)}>
                  {filteredDestinationStates.map((state) => (
                    <option key={state.id} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Source curriculum</label>
                <select className="select" value={form.sourceCurriculumId} onChange={(event) => updateField('sourceCurriculumId', event.target.value)}>
                  {filterableCurricula.sourceCurricula.length === 0 ? (
                    <option value="">No matching source curriculum for this grade</option>
                  ) : (
                    filterableCurricula.sourceCurricula.map((curriculum) => (
                      <option key={curriculum.id} value={curriculum.id}>{curriculum.title}</option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="label">Destination curriculum</label>
                <select className="select" value={form.destinationCurriculumId} onChange={(event) => updateField('destinationCurriculumId', event.target.value)}>
                  {filterableCurricula.destinationCurricula.length === 0 ? (
                    <option value="">No matching destination curriculum for this grade</option>
                  ) : (
                    filterableCurricula.destinationCurricula.map((curriculum) => (
                      <option key={curriculum.id} value={curriculum.id}>{curriculum.title}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div style={{ marginTop: '1.25rem', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.18)', borderRadius: '14px', padding: '0.9rem 1rem' }}>
            <div style={{ fontWeight: 800, color: '#8d1e2d', marginBottom: '0.5rem' }}>Please review these required fields:</div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#8d1e2d' }}>
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={create}>
            <Plus size={15} />
            Create case
          </button>
        </div>
      </section>
    </div>
  )
}
