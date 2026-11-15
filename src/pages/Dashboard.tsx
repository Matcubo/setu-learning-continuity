import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, FolderPlus, ShieldAlert, Sparkles, Users } from 'lucide-react'
import { loadCases, seedSampleCases } from '../services/storage'
import sampleCases from '../data/sampleCases'
import { TransitionCase } from '../types'

const statusMap: Record<string, string> = {
  new: 'New',
  under_review: 'Assessment Pending',
  approved: 'Approved',
}

export default function Dashboard() {
  const [cases, setCases] = useState<TransitionCase[]>(() => loadCases())

  useEffect(() => {
    seedSampleCases(sampleCases)
    setTimeout(() => setCases(loadCases()), 100)
  }, [])

  const total = cases.length
  const newCases = cases.filter((caseItem) => caseItem.status === 'new').length
  const pendingAssessment = cases.filter((caseItem) => caseItem.status === 'under_review').length
  const plansReady = cases.filter((caseItem) => caseItem.plan && !caseItem.plan.approved).length
  const approved = cases.filter((caseItem) => caseItem.status === 'approved').length

  const attentionCases = cases.filter((caseItem) => {
    const needsReview = caseItem.evidence.length === 0 || caseItem.status === 'new'
    return needsReview && (caseItem.plan === undefined || !caseItem.plan.approved)
  })

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="page-kicker">Teacher workspace</div>
          <h1 className="page-title">Transition overview</h1>
        </div>
        <Link to="/students/new" className="btn btn-primary">
          <FolderPlus size={17} />
          <span>Create case</span>
        </Link>
      </header>

      <section className="metric-grid">
        <div className="metric-card section-card">
          <div className="metric-label">Total cases</div>
          <div className="metric-value">{total}</div>
          <div className="metric-detail">Active learners</div>
        </div>
        <div className="metric-card section-card">
          <div className="metric-label">New</div>
          <div className="metric-value">{newCases}</div>
          <div className="metric-detail">Recently added</div>
        </div>
        <div className="metric-card section-card">
          <div className="metric-label">Awaiting assessment</div>
          <div className="metric-value">{pendingAssessment}</div>
          <div className="metric-detail">Needs review</div>
        </div>
        <div className="metric-card section-card">
          <div className="metric-label">Plans ready</div>
          <div className="metric-value">{plansReady}</div>
          <div className="metric-detail">Drafts</div>
        </div>
        <div className="metric-card section-card">
          <div className="metric-label">Approved</div>
          <div className="metric-value">{approved}</div>
          <div className="metric-detail">Ready to use</div>
        </div>
      </section>

      <div className="risk-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 className="section-title">Recent transitions</h2>
            <Link to="/students" className="inline-note" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Manage all <ArrowRight size={15} />
            </Link>
          </div>

          {cases.length === 0 ? (
            <div className="empty-state">No transition records yet.</div>
          ) : (
            <div className="table-list">
              {cases.slice(0, 5).map((caseItem) => (
                <div key={caseItem.id} className="case-row">
                  <div>
                    <Link to={`/students/${caseItem.id}`}>{caseItem.studentName}</Link>
                    <small>{caseItem.sourceState} → {caseItem.destinationState}</small>
                  </div>
                  <div className="inline-note">Class {caseItem.currentClass}</div>
                  <div>
                    <span className={`status-badge ${caseItem.status === 'approved' ? 'status-approved' : caseItem.status === 'under_review' ? 'status-review' : 'status-new'}`}>
                      {statusMap[caseItem.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldAlert size={18} color="#b45309" />
            <h2 className="section-title">Cases needing attention</h2>
          </div>

          {attentionCases.length === 0 ? (
            <div className="empty-state">Everything looks steady right now.</div>
          ) : (
            <div className="timeline">
              {attentionCases.slice(0, 4).map((caseItem) => (
                <div key={caseItem.id} className="timeline-step">
                  <div style={{ fontWeight: 700 }}>{caseItem.studentName}</div>
                  <div className="inline-note">{caseItem.sourceState} → {caseItem.destinationState}</div>
                  <div className="inline-note" style={{ marginTop: '0.25rem' }}>
                    {caseItem.evidence.length === 0 ? 'No academic evidence added yet.' : 'Evidence is incomplete. Review before finalising.'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="risk-grid">
        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={18} color="#0a8f8d" />
            <h2 className="section-title">Quick actions</h2>
          </div>
          <div className="cta-row">
            <Link to="/students/new" className="btn btn-primary">
              <Users size={16} />
              New transition
            </Link>
            <Link to="/students" className="btn btn-secondary">
              <ClipboardCheck size={16} />
              Review cases
            </Link>
          </div>
        </div>

        <div className="section-card card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ClipboardCheck size={18} color="#0a8f8d" />
            <h2 className="section-title">Status summary</h2>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>New cases</div>
              <div className="inline-note">{newCases} records entering the workflow.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Plan generation</div>
              <div className="inline-note">{plansReady} cases have draft learning plans ready.</div>
            </div>
            <div className="timeline-step">
              <div style={{ fontWeight: 700 }}>Approvals</div>
              <div className="inline-note">{approved} plans have been approved by teachers.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
