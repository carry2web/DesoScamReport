'use client';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error('Rendering ErrorFallback:', error.message);
  
  return (
    <div role="alert" style={{ color: 'red', padding: '1rem' }}>
      <p>❌ Something went wrong:</p>
      <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary} style={{ marginTop: '0.5rem' }}>
        Try again
      </button>
    </div>
  );
};
