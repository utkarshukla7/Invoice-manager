import React from 'react';
import styles from './loadingOverlay.module.css';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
            <div className={styles.spinner}>
                <div></div>   
                <div></div>    
                <div></div>    
                <div></div>    
                <div></div>    
                <div></div>    
                <div></div>    
                <div></div>    
                <div></div>    
                <div></div>    
            </div>
        </div>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
