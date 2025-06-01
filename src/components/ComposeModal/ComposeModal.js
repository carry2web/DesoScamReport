'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PostEditor } from '@/components/PostEditor';
import styles from './ComposeModal.module.css';

export const ComposeModal = ({ isDirect = false }) => {
  const router = useRouter();

  useEffect(() => {
    // Add modal class to body
    document.body.classList.add('modal-open');

    // Scroll lock logic
    const scrollY = window.scrollY;
    //const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    //document.documentElement.style.setProperty('--scrollbar-offset', `${scrollbarWidth}px`);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      // Remove modal class
      document.body.classList.remove('modal-open');

      //document.documentElement.style.setProperty('--scrollbar-offset', '0px');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleClose = () => {
    if (isDirect) {
      router.push('/'); // Direct access goes to home
    } else {
      router.back(); // In-app navigation goes back
    }
  };

  return (
    <>
      {/* Background for direct access */}
      {isDirect && (
        <div className={styles.background} />
      )}
      
      {/* Modal overlay */}
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>Compose Post</h2>
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className={styles.content}>
            {/* 🎉 Your PostEditor component! */}
            <PostEditor 
              onClose={handleClose} // ✨ Closes modal after successful post
            />
          </div>
        </div>
      </div>
    </>
  );
};