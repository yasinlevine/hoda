import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e221b',
            color: '#f1f5f9',
            fontFamily: 'Vazirmatn, sans-serif',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#242922',
              border: '1px solid #a3b18a',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h2 style={{ color: '#a3b18a', margin: '0 0 12px 0', fontSize: '20px', fontWeight: 'bold' }}>
              کلینیک هدی پژمان
            </h2>
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.7', margin: '0 0 20px 0' }}>
              در بارگذاری صفحه خطایی رخ داده است. با کلیک بر روی دکمه زیر حافظه موقت پاک شده و صفحه دوباره بارگذاری خواهد شد.
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch {
                  // ignore
                }
                window.location.reload();
              }}
              style={{
                backgroundColor: '#a3b18a',
                color: '#1e221b',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              بارگذاری مجدد سایت
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
