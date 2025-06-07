'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PostEditor } from '@/components/PostEditor';
import { useEditorPost } from '@/context/EditorPostContext';

import styles from './ComposeModal.module.css';

export const ComposeModal = ({ isDirect = false }) => {
  const router = useRouter();

  const { quotedPost, editablePost, clearEditorState } = useEditorPost();

  // ✅ Consume quoted/editable post from context immediately
  const [localQuotedPost] = useState(quotedPost);
  const [localEditablePost] = useState(editablePost);  

  useEffect(() => {
    if (localQuotedPost || localEditablePost) {
      clearEditorState(); // Clear context state when editor mounts and if there's a quoted or editable post
    }
  }, [localQuotedPost, localEditablePost]);

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

  // Determine modal title and mode
  const getModalTitle = () => {
    if (localQuotedPost) return 'Quote Post';
    if (localEditablePost) return 'Edit Post';
    return 'Compose Post';
  };

  const getEditorMode = () => {
    if (localQuotedPost) return 'quote';
    if (localEditablePost) return 'edit';
    return 'create';
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
            <h2>{getModalTitle()}</h2>
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close modal"
            >
              <span className={styles.closeIcon}>&times;</span>
            </button>
          </div>

          <div className={styles.content}>
            {/* 🎉 Your PostEditor component! */}
            <PostEditor 
              mode={getEditorMode()}
              quotedPost={localQuotedPost}
              editablePost={localEditablePost}
              onClose={handleClose}
            />            
          </div>
        </div>
      </div>
    </>
  );
};