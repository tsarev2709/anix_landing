import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
    if (typeof window !== 'undefined' && window.__hseMvpRenderError) {
      window.__hseMvpRenderError(error);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '48px 24px', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: 20 }}>Что-то пошло не так</h1>
          <p>Попробуйте вернуться назад или обновить страницу.</p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f4f4f4',
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <a href={process.env.PUBLIC_URL || '/'}>Вернуться на главную</a>
        </div>
      );
    }
    return this.props.children;
  }
}
