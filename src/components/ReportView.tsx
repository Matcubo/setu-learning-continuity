import React from 'react'
import { TransitionCase } from '../types'
import { curricula } from '../data/curricula'

export default function ReportView({ caseData }: { caseData: TransitionCase }){
  const source = caseData.sourceCurriculumId ? curricula.find(c => c.id === caseData.sourceCurriculumId) : null
  const dest = caseData.destinationCurriculumId ? curricula.find(c => c.id === caseData.destinationCurriculumId) : null

  return (
    <div className="p-6 bg-white text-navy">
      <h1 className="text-2xl font-bold">SETU — Student Transition Report</h1>
      <div className="text-sm text-muted mt-2">Generated: {new Date().toLocaleString()}</div>
      <div className="mt-4">
        <h2 className="font-semibold">Case overview</h2>
        <div className="text-sm">Student: {caseData.studentName}</div>
        <div className="text-sm">Class: {caseData.currentClass}</div>
        <div className="text-sm">From: {caseData.sourceState} {source ? `(${source.title})` : '(Curriculum mapping pending)'}</div>
        <div className="text-sm">To: {caseData.destinationState} {dest ? `(${dest.title})` : '(Curriculum mapping pending)'}</div>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold">Previous learning evidence</h2>
        <ul className="list-disc ml-6 text-sm">
          {caseData.evidence.length>0 ? caseData.evidence.map((e,idx)=> <li key={idx}>{e.subject} — {e.topicId} — {e.evidenceType} — {e.note}</li>) : <li>No evidence provided.</li>}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold">Suggested transition plan</h2>
        {caseData.plan ? (
          <div>
            <div className="text-sm">Plan generated: {caseData.plan.generatedAt}</div>
            <div className="mt-2 space-y-2">
              {caseData.plan.weeks.map(w=> (
                <div key={w.week} className="border p-2">
                  <div className="font-semibold">Week {w.week}</div>
                  <div className="text-sm">Objectives: {w.objectives.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="text-sm">No plan generated.</div>}
      </div>

      <div className="mt-4 text-sm text-muted">Prototype / demo: synthetic data only. Recommendations should be reviewed by a teacher.</div>
    </div>
  )
}
