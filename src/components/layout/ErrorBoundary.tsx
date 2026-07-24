import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertTriangle size={40} className="text-brand" aria-hidden />
          <h1 className="text-xl font-bold">משהו השתבש</h1>
          <p className="text-text-muted max-w-xs">
            אירעה שגיאה בלתי צפויה. הנתונים שלך שמורים באחסון המקומי ולא נפגעו.
          </p>
          <Button onClick={() => window.location.assign('/')}>חזרה למסך הבית</Button>
        </div>
      )
    }
    return this.props.children
  }
}
