import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppStateProvider } from './store/AppStateContext'
import { ToastProvider } from './components/ui/Toast'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { BottomNav } from './components/layout/BottomNav'
import { Home } from './pages/Home'
import { Plan } from './pages/Plan'
import { ActiveWorkout } from './pages/ActiveWorkout'
import { WorkoutSummary } from './pages/WorkoutSummary'
import { WeeklyAssessment } from './pages/WeeklyAssessment'
import { Progress } from './pages/Progress'
import { ExerciseLibrary } from './pages/ExerciseLibrary'
import { Settings } from './pages/Settings'

function AppShell() {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/workout/')

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/workout/:workoutId/:week/:slot" element={<ActiveWorkout />} />
        <Route path="/summary/:sessionId" element={<WorkoutSummary />} />
        <Route path="/assessment/:week" element={<WeeklyAssessment />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/library" element={<ExerciseLibrary />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <ToastProvider>
          <HashRouter>
            <AppShell />
          </HashRouter>
        </ToastProvider>
      </AppStateProvider>
    </ErrorBoundary>
  )
}

export default App
