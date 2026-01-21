import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    this.setState(prevState => ({
      ...prevState,
      errorInfo,
    }));
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Something Went Wrong
            </h1>

            {/* Error Description */}
            <p className="text-center text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try reloading the page.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-h-40 overflow-auto">
                <p className="text-xs font-mono text-red-700 break-words">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <p className="text-xs font-mono text-red-600 mt-2 whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack.substring(0, 500)}...
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Reload Page
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="w-full bg-gray-50 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Go Home
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                If this problem persists, please contact us:
              </p>
              <a
                href="mailto:support@autodrivedepot.com"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                support@autodrivedepot.com
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
