import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-4 text-white">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>

            <h1 className="mt-6 font-display text-3xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-3 text-gray-300">
              We apologize for the inconvenience. An unexpected error has occurred. You can try reloading the page to continue.
            </p>

            {this.state.error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Error details
                </p>
                <pre className="mt-2 overflow-auto rounded-lg bg-black/30 p-3 text-xs text-red-200">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-2xl shadow-white/10 transition-all hover:scale-105 hover:shadow-white/20"
            >
              <RotateCcw className="h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
