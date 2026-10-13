import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class EvoErrorBoundary extends Component<Props, State> {
  readonly state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-zinc-400">
          <h1 className="text-xl font-bold">Ocurrió un error.</h1>
          <p>Por favor recargue la página.</p>
        </div>
      );
    }

    return ((this as any).props as Props).children;
  }
}
