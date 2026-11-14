import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentView from './pages/StudentView'
import Settings from './pages/Settings'
import NewStudent from './pages/NewStudent'

export default function App(){
  return (
    <div className="min-h-screen bg-ivory text-navy">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">S</div>
            <div>
              <div className="text-lg font-bold">SETU</div>
              <div className="text-xs text-gray-600">A New School. Not a New Beginning.</div>
            </div>
          </Link>
          <nav className="space-x-4">
            <Link to="/dashboard" className="text-sm text-teal-600 hover:underline">Teacher Dashboard</Link>
            <Link to="/students" className="text-sm text-teal-600 hover:underline">Transitions</Link>
            <Link to="/settings" className="text-sm text-teal-600 hover:underline">Settings</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<NewStudent />} />
          <Route path="/students/:id" element={<StudentView />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}
