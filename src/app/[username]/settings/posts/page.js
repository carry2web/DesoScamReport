'use client';

import { useState, useRef } from 'react';
import { useDeSoApi } from '@/api/useDeSoApi';
import { useAuth } from '@/context/AuthContext';
import { useUser } from "@/context/UserContext";
import styles from './page.module.css';

const BATCH_SIZE = 100;

const Page = () => {
  const { userPublicKey, signAndSubmitTransaction } = useAuth();
  const { userProfile } = useUser();
  const { getPostsForPublicKey, submitPost } = useDeSoApi();

  const [deleting, setDeleting] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);
  const [hardDelete, setHardDelete] = useState(false);
  const cancelRef = useRef(false);


    const deleteAllPosts = async () => {
        if (!userPublicKey) return;
    
        setDeleting(true);
        setDeletedCount(0);
        cancelRef.current = false;
    
        let lastPostHashHex = '';
    
        while (!cancelRef.current) {
            const response = await getPostsForPublicKey({
                PublicKeyBase58Check: userPublicKey,
                Username: '',
                LastPostHashHex: lastPostHashHex,
                NumToFetch: BATCH_SIZE,
                MediaRequired: false,
                ReaderPublicKeyBase58Check: '',
            });
        
            if (!response.success || !response.data.Posts?.length) break;
        
            for (const post of response.data.Posts) {
                if (cancelRef.current) break;
        
                // const settings = {
                //     UpdaterPublicKeyBase58Check: userPublicKey,
                //     Body: post?.Body || "",
                //     VideoURLs: post?.VideoURLs || null,
                //     ImageURLs: post?.ImageURLs || null,
                //     RepostedPostHashHex: post?.RepostedPostEntryResponse?.PostHashHex || "",
                //     PostHashHexToModify: post.PostHashHex,
                //     PostExtraData: post.PostExtraData ? { ...post.PostExtraData } : undefined,
                //     IsHidden: true,
                //     MinFeeRateNanosPerKB: 1500,
                // };

                // support had delete
                const settings = {
                  UpdaterPublicKeyBase58Check: userPublicKey,
                  //Body: hardDelete ? "deleted" : post?.Body || "",
                  Body: hardDelete && post?.Body ? "deleted" : post?.Body || "", // no need to put 'deleted' if post body is empty
                  VideoURLs: hardDelete ? [] : post?.VideoURLs || null,
                  ImageURLs: hardDelete ? [] : post?.ImageURLs || null,
                  //RepostedPostHashHex: hardDelete ? "" : post?.RepostedPostEntryResponse?.PostHashHex || "",
                  RepostedPostHashHex: post?.RepostedPostEntryResponse?.PostHashHex || "",
                  PostHashHexToModify: post.PostHashHex,
                  PostExtraData: hardDelete ? {} : post.PostExtraData ? { ...post.PostExtraData } : undefined,
                  IsHidden: true,
                  MinFeeRateNanosPerKB: 1500,
                };                
        
                try {
                    const result = await submitPost(settings);
            
                    if (result.success && result.data?.TransactionHex) {
                        const txResult = await signAndSubmitTransaction(result.data.TransactionHex);
            
                        if (txResult?.PostEntryResponse) {
                            setDeletedCount((count) => count + 1);
                        } else {
                            console.warn("Post deletion failed to finalize:", txResult);
                        }
                    } else if (result.error) {
                        console.error("submitPost error:", result.error);
                    }
                } catch (error) {
                    console.error("Post deletion error:", error);
                }
            }
        
            const lastPost = response.data.Posts[response.data.Posts.length - 1];
            lastPostHashHex = lastPost?.PostHashHex;
        
            if (!lastPostHashHex || response.data.Posts.length < BATCH_SIZE) break;
        }
    
        setDeleting(false);
    };
  


  const cancelDelete = () => {
    cancelRef.current = true;
  };

  return (
    <div className={styles.container}>
      <h1>Post Management</h1>


        <div className={styles.userInfo}>
          <div><strong>Username:</strong> {userProfile?.Username}</div>
          <div><strong>Public Key:</strong> {userPublicKey}</div>
        </div>

      <p>Click the button below to hide all your posts in bulk.</p>   

      <div className={styles.controls}>
        <button
          className={styles.deleteButton}
          onClick={deleteAllPosts}
          disabled={deleting || !userPublicKey}
        >
          Delete All Posts
        </button>

        {deleting && (
          <button className={styles.cancelButton} onClick={cancelDelete}>
            Cancel
          </button>
        )}
      </div>

      <div className={styles.status}>
        {deleting ? `Deleting... ${deletedCount} posts so far.` : `Deleted: ${deletedCount} posts`}
      </div>


      <label className={styles.hardDeleteOption}>
        <input
          type="checkbox"
          checked={hardDelete}
          onChange={() => setHardDelete(!hardDelete)}
          disabled={deleting}
        />
        <span>
          <strong style={{ color: 'red' }}>WARNING!</strong> This is <strong>OPTIONAL!</strong> If you check this, your posts
          will be not just hidden but also overwritten with the word <strong>"deleted"</strong>, all attached media will also be removed.
          <br />
          If you do this, it will be <strong>extremely hard</strong> to restore the original content of your post.
          <br />
          <em>I am not responsible to restore your posts.</em>
        </span>
      </label>   

      <br />
      <br />
      <span>PS Make sure you have some DESO balance on your accout to cover transaction fees</span>

    </div>
  );
};

export default Page;