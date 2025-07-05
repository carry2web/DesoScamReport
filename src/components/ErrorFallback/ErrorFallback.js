'use client';

import { Button } from "@/components/Button";
import styles from './ErrorFallback.module.css';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error('Rendering ErrorFallback:', error.message);
  
  return (
    <div role="alert" className={styles.errorFallback}>
      <p>❌ Something went wrong:</p>
      <pre>{error.message}</pre>
      <Button
        onClick={resetErrorBoundary}
        variant="secondary"
      >
        Retry
      </Button>      
    </div>
  );
};
