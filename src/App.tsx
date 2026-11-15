import React, { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { BookOpenCheck, LayoutDashboard, Menu, Settings as SettingsIcon, Users, X } from 'lucide-react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import StudentView from './pages/StudentView'
import Settings from './pages/Settings'
import NewStudent from './pages/NewStudent'

const navItems = [
  { to: '/dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Transitions', icon: Users },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ivory text-navy">
      <div className="app-shell">
        <button className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label="Toggle navigation">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <aside className={`sidebar-shell ${mobileOpen ? 'mobile-open' : ''}`}>
          <div className="brand-block">
            <div className="brand-mark">S</div>
            <div>
              <div className="brand-title">SETU</div>
              <div className="brand-subtitle">A New School. Not a New Beginning.</div>
            </div>
          </div>

          <nav className="nav-stack">
            <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              <BookOpenCheck size={18} />
              <span>Overview</span>
            </NavLink>
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-note">
            <div className="mini-label">Demo workspace</div>
            <div className="mini-text">Rule-based transition planning for migrant learners across India.</div>
          </div>
        </aside>

        <main className="main-shell">
          <div className="topbar">
            <div>
              <div className="page-kicker">National learning continuity</div>
              <div className="topbar-title">SETU operations</div>
            </div>
            <NavLink to="/students/new" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Create a Transition
            </NavLink>
          </div>

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
    </div>
  )
}
