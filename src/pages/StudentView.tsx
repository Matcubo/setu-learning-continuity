import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { loadCases, saveCases } from '../services/storage'
import { TransitionCase, CurriculumComparison } from '../types'
import { curricula } from '../data/curricula'
import { compareCurricula, generateTransitionPlan } from '../services/agents'

export default function StudentView(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState<TransitionCase | null>(null)
  const [comparisons, setComparisons] = useState<CurriculumComparison[] | null>(null)
  const [editingPlan, setEditingPlan] = useState(false)

  useEffect(()=>{
    const cases = loadCases()
    const found = cases.find(c=>c.id === id)
    if(!found) return navigate('/students')
    setCaseData(found)
  },[id])

  useEffect(()=>{
    if(!caseData) return
    setComparisons(compareCurricula(caseData))
  },[caseData])

  function generatePlan(){
    if(!caseData || !comparisons) return
    const plan = generateTransitionPlan(caseData, comparisons)
    const updated = { ...caseData, plan, status: 'under_review' as any }
    updateCase(updated)
  }

  function updateCase(next: TransitionCase){
    const all = loadCases()
    const rest = all.filter(c=>c.id!==next.id)
    const combined = [next, ...rest]
    saveCases(combined)
    setCaseData(next)
  }

  function approvePlan(){
    if(!caseData || !caseData.plan) return
    const updated = { ...caseData, status: 'approved', plan: { ...caseData.plan, approved: true } }
    updateCase(updated)
    setEditingPlan(false)
  }

  function updateWeek(weekNum: number, objectives: string[], activities: string[]){
    if(!caseData?.plan) return
    const updated = { ...caseData, plan: { ...caseData.plan, weeks: caseData.plan.weeks.map(w=> w.week===weekNum ? {...w, objectives, activities} : w) } }
    updateCase(updated)
  }

  if(!caseData) return <div>Loading...</div>

  const sourceCurr = curricula.find(c=>c.id===caseData.sourceCurriculumId)
  const destCurr = curricula.find(c=>c.id===caseData.destinationCurriculumId)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{caseData.studentName}</h1>
          <div className="text-sm text-muted">{caseData.sourceState} → {caseData.destinationState} • Class {caseData.currentClass}</div>
        </div>
        <div className="flex gap-2">
          <Link to="/students" className="px-3 py-2 border rounded">Back</Link>
          {!caseData.plan && <button className="px-3 py-2 bg-teal-500 text-white rounded" onClick={()=>generatePlan()}>Generate 4-week plan</button>}
          {caseData.plan && !caseData.plan.approved && <button className="px-3 py-2 bg-[#f2a900] text-white rounded" onClick={()=>approvePlan()}>Approve plan</button>}
          {caseData.plan && <button className="px-3 py-2 bg-gray-500 text-white rounded" onClick={()=>window.print()}>Print</button>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Academic record from {caseData.sourceState}</h2>
          {caseData.academicRecords.map(rec=> (
            <div key={rec.subject} className="mt-3 border-t pt-3">
              <h3 className="font-medium">{rec.subject}</h3>
              <div className="text-sm text-muted mt-1">Completed topics:</div>
              <ul className="mt-2 list-disc ml-6 text-sm">
                {rec.completedTopicIds.length>0 ? rec.completedTopicIds.map(t=> <li key={t}>{t}</li>) : <li className="text-gray-400">None provided</li>}
              </ul>
              {rec.observations && <div className="text-sm mt-2">Observations: <span className="text-muted">{rec.observations}</span></div>}
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Evidence provided</h2>
          {caseData.evidence.length>0 ? (
            <ul className="mt-3 space-y-2">
              {caseData.evidence.map((e,i)=> (
                <div key={i} className="border-l-2 border-teal-500 pl-3 text-sm">
                  <div className="font-medium">{e.subject} — {e.topicId}</div>
                  <div className="text-muted">{e.evidenceType}</div>
                  {e.note && <div className="text-xs mt-1">{e.note}</div>}
                </div>
              ))}
            </ul>
          ) : (
            <div className="mt-3 text-sm text-gray-400">No evidence provided yet.</div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Curriculum comparison</h2>
        {comparisons && comparisons.length>0 ? (
          comparisons.map(comp=> (
            <div key={comp.subject} className="mt-4 border-t pt-3">
              <h3 className="font-medium">{comp.subject}</h3>
              <div className="grid md:grid-cols-3 gap-3 mt-2">
                <div>
                  <h4 className="text-sm font-semibold text-green-700">Supported ({comp.confirmed.length})</h4>
                  <ul className="mt-2 list-disc ml-4 text-sm">
                    {comp.confirmed.length>0 ? comp.confirmed.map(m=> <li key={m.topic.id}>{m.topic.title}</li>) : <li className="text-gray-400">—</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-700">Possible gap ({comp.possible.length})</h4>
                  <ul className="mt-2 list-disc ml-4 text-sm">
                    {comp.possible.length>0 ? comp.possible.map(m=> <li key={m.topic.id}>{m.topic.title}</li>) : <li className="text-gray-400">—</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-700">Unknown ({comp.unknown.length})</h4>
                  <ul className="mt-2 list-disc ml-4 text-sm">
                    {comp.unknown.length>0 ? comp.unknown.map(m=> <li key={m.topic.id}>{m.topic.title}</li>) : <li className="text-gray-400">—</li>}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : <div className="text-sm text-gray-400">Comparing curricula...</div>}
      </div>

      {caseData.plan && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold">4-week transition plan</h2>
              <div className="text-xs text-muted mt-1">{caseData.plan.approved ? 'APPROVED' : 'DRAFT'}</div>
            </div>
            {!caseData.plan.approved && <button className="text-sm text-teal-600" onClick={()=>setEditingPlan(!editingPlan)}>Edit</button>}
          </div>
          <div className="mt-2 text-xs text-gray-500">Language: {caseData.plan.languageAdaptationNotes}</div>

          <div className="space-y-3 mt-4">
            {caseData.plan.weeks.map(w=> (
              <div key={w.week} className="border p-3 rounded bg-ivory">
                <div className="font-semibold">Week {w.week}</div>
                {editingPlan ? (
                  <div className="mt-2 space-y-2">
                    <div>
                      <label className="text-sm">Objectives</label>
                      <textarea className="w-full border p-2 text-sm" value={w.objectives.join('\n')} onChange={e=>updateWeek(w.week, e.target.value.split('\n'), w.activities)} />
                    </div>
                    <div>
                      <label className="text-sm">Activities</label>
                      <textarea className="w-full border p-2 text-sm" value={w.activities.join('\n')} onChange={e=>updateWeek(w.week, w.objectives, e.target.value.split('\n'))} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm mt-2">
                      <div className="font-medium">Objectives:</div>
                      <ul className="list-disc ml-4">{w.objectives.map(o=> <li key={o} className="text-xs">{o}</li>)}</ul>
                    </div>
                    <div className="text-sm mt-2">
                      <div className="font-medium">Activities:</div>
                      <ul className="list-disc ml-4">{w.activities.map(a=> <li key={a} className="text-xs">{a}</li>)}</ul>
                    </div>
                    <div className="text-xs mt-1">Assessment: {w.assessment}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          {!caseData.plan.approved && (
            <div className="mt-4">
              <label className="block text-sm">Teacher comments</label>
              <textarea className="w-full border p-2 mt-1 text-sm" value={caseData.plan.teacherComments} onChange={e=>{
                const updated = { ...caseData, plan: { ...caseData.plan!, teacherComments: e.target.value } }
                updateCase(updated)
              }} />
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-2 bg-teal-500 text-white rounded" onClick={()=>approvePlan()}>Approve</button>
                <button className="px-3 py-2 bg-gray-500 text-white rounded" onClick={()=>window.print()}>Print / Export</button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
