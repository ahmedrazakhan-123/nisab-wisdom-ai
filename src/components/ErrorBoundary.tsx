
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      const isDev = import.meta.env && import.meta.env.DEV;
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h1 className="text-4xl font-bold text-destructive mb-4">Oops! Something went wrong.</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            We've encountered an unexpected error. Our team has been notified. Please try refreshing the page to continue.
          </p>
      {isDev && (this.state.error || this.state.errorInfo) && (
            <div className="w-full max-w-2xl text-left bg-muted/30 border border-border rounded-md p-4 mb-4 overflow-auto">
              <p className="font-semibold mb-2">Error details (dev only)</p>
              <pre className="text-xs whitespace-pre-wrap break-words">
                {this.state.error?.message}
                {"\n\n"}
                {this.state.error?.stack}
        {this.state.errorInfo?.componentStack ? "\n\nComponent stack:\n" + this.state.errorInfo.componentStack : ""}
              </pre>
            </div>
          )}
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
