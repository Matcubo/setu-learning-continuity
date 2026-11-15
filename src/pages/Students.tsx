import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Trash2 } from 'lucide-react'
import { loadCases, saveCases } from '../services/storage'
import sampleCases from '../data/sampleCases'
import { TransitionCase } from '../types'

const statusLabels: Record<string, string> = {
  new: 'New',
  under_review: 'Assessment Pending',
  approved: 'Approved',
}

export default function Students() {
  const [cases, setCases] = useState<TransitionCase[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'under_review' | 'approved'>('all')

  useEffect(() => {
    const loaded = loadCases()
    if (loaded.length === 0) {
      saveCases(sampleCases)
      setCases(sampleCases)
    } else {
      setCases(loaded)
    }
  }, [])

  function deleteCase(id: string) {
    if (!confirm('Delete this demo case?')) return
    const next = cases.filter((caseItem) => caseItem.id !== id)
    setCases(next)
    saveCases(next)
  }

  const filteredCases = cases.filter((caseItem) => {
    if (statusFilter !== 'all' && caseItem.status !== statusFilter) return false
    if (query && !caseItem.studentName.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <div className="page-kicker">Student continuity</div>
          <h1 className="page-title">Transition cases</h1>
        </div>
        <Link to="/students/new" className="btn btn-primary">
          <Plus size={16} />
          <span>New transition</span>
        </Link>
      </header>

      <section className="section-card card-body">
        <div className="form-grid" style={{ gridTemplateColumns: '1.5fr 0.6fr' }}>
          <div style={{ position: 'relative' }}>
            <label className="label">Search student</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '0.9rem', color: '#526176' }} />
              <input
                className="input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search by student name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | 'new' | 'under_review' | 'approved')}
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="under_review">Assessment pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          {filteredCases.length === 0 ? (
            <div className="empty-state">No students match the current search or status filter.</div>
          ) : (
            <div className="table-list">
              {filteredCases.map((caseItem) => (
                <div key={caseItem.id} className="case-row">
                  <div>
                    <Link to={`/students/${caseItem.id}`}>{caseItem.studentName}</Link>
                    <small>{caseItem.sourceState} → {caseItem.destinationState} • Class {caseItem.currentClass}</small>
                  </div>
                  <div>
                    <span className={`status-badge ${caseItem.status === 'approved' ? 'status-approved' : caseItem.status === 'under_review' ? 'status-review' : 'status-new'}`}>
                      {statusLabels[caseItem.status]}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost" onClick={() => deleteCase(caseItem.id)}>
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
