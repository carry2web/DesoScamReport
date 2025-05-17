import { PublicKeyDisplay } from '@/components/PublicKeyDisplay';

import styles from './Profile.module.css';

export const ErrorState = ({ message, rawParam }) => (
  <div className={styles.container}>

      <div className={styles.profileContainer}>

          <div className={styles.profileDetails}>

              <p className={styles.error}>{message}</p>

              <div className={styles.basic}>
                  <PublicKeyDisplay value={rawParam} mode="full"/>
              </div>

          </div>
      </div>
  </div>
);