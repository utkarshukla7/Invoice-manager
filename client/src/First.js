// First.js
import { useAuth0 } from '@auth0/auth0-react';
import styles from './First.module.css';

const First = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.appName}>
          <span className={styles.billText}>Bill</span>
          <span className={styles.easeText}>Ease</span>
        </div>
        <div className={styles.authButtons}>
          {!isAuthenticated && (
            <button onClick={loginWithRedirect} className={styles.loginButton}>
              Login/Register
            </button>
          )}
          {isAuthenticated && (
            <>
              <span className={styles.userGreeting}>
                Welcome, {user.name}
              </span>
              <button onClick={() => logout()} className={styles.logoutButton}>
                Log Out
              </button>
            </>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.appNameHeading}>
          <span className={styles.billText}>Bill</span>
          <span className={styles.easeText}>Ease</span>
        </h1>
        <h2 className={styles.heading}>
          Managing Finances,
          <br />
          One Bill at a Time.
        </h2>
        <p className={styles.tagline}>Built for Growing India.</p>
        {!isAuthenticated && (
          <button onClick={loginWithRedirect} className={styles.getStartedButton}>
            Get Started
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={() => (window.location.href = '/dashboard')}
            className={styles.getStartedButton}
          >
            Go to Dashboard
          </button>
        )}
      </main>
    </div>
  );
};

export default First;