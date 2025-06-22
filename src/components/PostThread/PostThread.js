// PostThread.js - Enhanced with smart display logic
"use client";

import { useState, useRef, useEffect } from 'react';
import { Post } from '@/components/Post';
import styles from './PostThread.module.css';

export const PostThread = ({ parentPosts, currentPost, username, userProfile }) => {
  const [showFullThread, setShowFullThread] = useState(false);
  const currentPostRef = useRef(null);

  // Helper function to validate and chain parent posts
  const getValidParentChain = (parentPosts, currentPost) => {
    if (!parentPosts || !Array.isArray(parentPosts) || parentPosts.length === 0) {
      return [];
    }

    const validChain = [];
    let expectedParentId = "";

    for (const parentPost of parentPosts) {
      if (parentPost.ParentStakeID === expectedParentId) {
        validChain.push(parentPost);
        expectedParentId = parentPost.PostHashHex;
      } else {
        break;
      }
    }

    if (validChain.length > 0 && currentPost.ParentStakeID === validChain[validChain.length - 1].PostHashHex) {
      return validChain;
    } else if (validChain.length === 0 && currentPost.ParentStakeID === "") {
      return [];
    }

    return [];
  };

  const validParentChain = getValidParentChain(parentPosts, currentPost);

  // Smart display logic
  const IMMEDIATE_CONTEXT_LIMIT = 2; // Show 2 immediate parents by default
  const AUTO_EXPAND_THRESHOLD = 3;   // Auto-show all if thread is short

  const shouldAutoExpand = validParentChain.length <= AUTO_EXPAND_THRESHOLD;
  const hasMoreParents = validParentChain.length > IMMEDIATE_CONTEXT_LIMIT;
  
  // Determine what to show
  const parentsToShow = shouldAutoExpand || showFullThread 
    ? validParentChain 
    : validParentChain.slice(-IMMEDIATE_CONTEXT_LIMIT); // Show last N parents (closest to current)

  const hiddenParentCount = validParentChain.length - parentsToShow.length;

  // If no valid chain, just render the current post
  if (validParentChain.length === 0) {
    return (
      <Post 
        post={currentPost} 
        username={username}
        userProfile={userProfile}
        isInThread={true}
      />
    );
  }

  // Scroll to the current post when thread is rendered
  useEffect(() => {
    if (currentPostRef.current) {
      // Small delay to ensure the thread is fully rendered
      const timer = setTimeout(() => {
        currentPostRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []); // add [showFullThread]); to re-scroll when thread expands/collapses  

  return (
    <div className={styles.threadContainer}>
      {/* Show thread expansion button if needed */}
      {hasMoreParents && !shouldAutoExpand && !showFullThread && (
        <div className={styles.threadExpansion}>
          <button 
            onClick={() => setShowFullThread(true)}
            className={styles.showThreadButton}
          >
            <div className={styles.threadIndicator}>
              🧵
            </div>
            Show {hiddenParentCount} earlier {hiddenParentCount === 1 ? 'post' : 'posts'} in thread
          </button>
        </div>
      )}

      {/* Collapse thread option if expanded */}
      {showFullThread && hasMoreParents && (
        <div className={styles.threadCollapse}>
          <button 
            onClick={() => setShowFullThread(false)}
            className={styles.collapseThreadButton}
          >
            <div className={styles.threadIndicator}>
              ⏫
            </div>            
            Collapse thread
          </button>
        </div>
      )}      

      {/* Render visible parent posts */}
      {parentsToShow.map((parentPost, index) => {
        const isFirstVisible = index === 0;
        const isLastParent = index === parentsToShow.length - 1;
        
        return (
          <div key={parentPost.PostHashHex} className={styles.threadPostWrapper}>
            {/* Show continuation indicator for first visible post if thread was truncated */}
            {isFirstVisible && !showFullThread && hasMoreParents && !shouldAutoExpand && (
              <div className={styles.threadContinuation}>
                <div className={styles.threadDelimeter}/>
              </div>
            )}
            
            <Post 
              post={parentPost} 
              // isComment={true}
              // isStatsDisabled={true}
              isInThread={true}
            />
            
            {!isLastParent && (
              <div className={styles.threadConnector}>
                <div className={styles.threadDelimeter}/>
              </div>
            )}
          </div>
        );
      })}
      
      {/* Final connector to current post */}
      {parentsToShow.length > 0 && (
        <div className={styles.threadConnector}>
            <div className={styles.threadDelimeter}/>
        </div>
      )}
      
      {/* Render current post - highlighted as the target */}
      <div className={`${styles.threadPostWrapper} ${styles.targetPost}`} ref={currentPostRef}>
        <Post 
          post={currentPost} 
          username={username}
          userProfile={userProfile}
        //   isComment={validParentChain.length > 0}
          isInThread={true}
          isHighlighted={true}
        />
      </div>

    </div>
  );
};


// simle version without smart display logic
// // PostThread.js
// "use client";

// import { Post } from '@/components/Post';
// import styles from './PostThread.module.css';

// export const PostThread = ({ parentPosts, currentPost }) => {
//   // Helper function to validate and chain parent posts
//   const getValidParentChain = (parentPosts, currentPost) => {
//     if (!parentPosts || !Array.isArray(parentPosts) || parentPosts.length === 0) {
//       return [];
//     }

//     // Validate the chain by checking ParentStakeID relationships
//     const validChain = [];
//     let expectedParentId = "";

//     for (const parentPost of parentPosts) {
//       if (parentPost.ParentStakeID === expectedParentId) {
//         validChain.push(parentPost);
//         expectedParentId = parentPost.PostHashHex;
//       } else {
//         // Chain is broken, stop here
//         break;
//       }
//     }

//     // Verify that the current post's ParentStakeID matches the last parent
//     if (validChain.length > 0 && currentPost.ParentStakeID === validChain[validChain.length - 1].PostHashHex) {
//       return validChain;
//     } else if (validChain.length === 0 && currentPost.ParentStakeID === "") {
//       // This is a root post, no parents needed
//       return [];
//     }

//     // If validation fails, return empty array to be safe
//     return [];
//   };

//   const validParentChain = getValidParentChain(parentPosts, currentPost);

//   // If no valid chain, just render the current post
//   if (validParentChain.length === 0) {
//     return (
//       <Post 
//         post={currentPost} 
//       />
//     );
//   }

//   return (
//     <div className={styles.threadContainer}>
//       {/* Render parent posts */}
//       {validParentChain.map((parentPost, index) => (
//         <div key={parentPost.PostHashHex} className={styles.threadPostWrapper}>
//           <Post 
//             post={parentPost} 
//             isInThread={true}
//             // isComment={index > 0} 
//             // isStatsDisabled={true}
//           />
//           <div className={styles.threadConnector}></div>
//         </div>
//       ))}
      
//       {/* Render current post */}
//       <div className={styles.threadPostWrapper}>
//         <Post 
//           post={currentPost} 
//           isInThread={true}
//           // isComment={validParentChain.length > 0}
//         />
//       </div>
//     </div>
//   );
// };