import { Placeholder } from "@/components/Placeholder";
import styles from './Notification.module.css';

export const NotificationPlaceholder = () => {

  return (
    <div className={styles.notification}>

        <div className={styles.infoIcon}>
            <Placeholder width="25px" height="25px" style={{marginTop: "3px"}}/>
        </div>

        <div className={styles.notificationContent}>

            <div className={styles.notificationHeader}>
                
                <Placeholder width="48px" height="48px" className={styles.avatar}/>
                <Placeholder width="45px" height="45px" className={styles.avatarMobile}/>

                <div className={styles.notificationSummary}>

                    <Placeholder width="80px" height="var(--font-size-base)" style={{marginTop: "5px"}} />                    

                    <div className={styles.postLinkWrapper}>
                        <Placeholder width="160px" height="var(--font-size-xs)" />  
                    </div>

                </div>
            </div>

            <Placeholder width="100%" height="42px" />
        </div>
    </div>
  );
};