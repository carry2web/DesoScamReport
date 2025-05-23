"use client";

import { useState } from "react"

import { Page } from "@/components/Page";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { useDeSoApi } from "@/api/useDeSoApi";

import { Button } from "@/components/Button";

import { useToast } from "@/hooks/useToast";

import Link from 'next/link';

import styles from "./page.module.css";
import { Post } from "@/components/Post";

export default function Home() {

  const { 
    userPublicKey, isAuthChecking, 
    signAndSubmitTransaction
  } = useAuth();

  const {
    showErrorToast,
    showSuccessToast,
  } = useToast();    

  const { userProfile } = useUser();

  const { submitPost } = useDeSoApi();

  // for post
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);  
  const [postError, setPostError] = useState(null);  
  const [lastPostTransaction, setLastPostTransaction] = useState(null);  

  const handlePostChange = (event) => {
    if(postError){  
      setPostError(null) // clears possible error from previous post attempt
    }

    setPostText(event.target.value);
  };

  const handleSubmitPost = async () => {

    setLoading(true)

    try {

      let settings = {
        UpdaterPublicKeyBase58Check: userPublicKey,
        BodyObj: {
          Body: postText,
        },        
        MinFeeRateNanosPerKB: 1500
      }    
          
      const result = await submitPost(settings)    
      console.log("createSubmitPostTransaction result: ", result)

      if(result.error){
          console.log("error: ", result.error)
          setPostError(result.error)
          showErrorToast(`Failed to publish post: ${result.error}`)
      }

      if(result.success && result.data?.TransactionHex){

        const postTransaction = await signAndSubmitTransaction(result.data?.TransactionHex)
        const { TxnHashHex } = postTransaction

        // toast.success('Post published successfully 🎉');

        // Updated toast with link included in the message
        showSuccessToast(
          <div>
            Post published to DeSo successfully 🎉
            <br />
            <a 
              href={`https://focus.xyz/post/${TxnHashHex}`} 
              target="_blank" 
              rel="noreferrer"
            >
              See your post at Focus App
            </a>
          </div>,
          {
            autoClose: 7000  // 7 seconds (in milliseconds)
          }
        );        

        // postTransaction.PostEntryResponse is posted post
        console.log({postTransaction})
        setLastPostTransaction(postTransaction)

        setPostText(""); // ✅ clear post      
      }      

      setLoading(false)

    } catch (error) {
      const errorMessage = error?.message || 'Error submitting a post'
      setPostError(errorMessage);
      showErrorToast(`Failed to publish post: ${errorMessage}`)
      setLoading(false)
    }   
  }  

  return (
    <Page>
      <div className={styles.pageContainer}>

        {/* Public Key Loading State */}
        {isAuthChecking && <div>Checking authentication...</div>}


        {userPublicKey && (
          <div className={styles.postContainer}>
            <textarea 
              disabled={loading || isAuthChecking} 
              value={postText} 
              onChange={handlePostChange} 
              placeholder={`Write some epic post to DeSo as ${userProfile?.Username || userPublicKey}`} 
            /> 

            {/* <button disabled={loading || !postText || isAuthChecking} onClick={handleSubmitPost}>Post to DeSo</button>   */}

            <Button disabled={!postText || isAuthChecking} isLoading={loading} onClick={handleSubmitPost}>Post to DeSo</Button>

            {
              lastPostTransaction && lastPostTransaction?.PostEntryResponse &&
              <Post
                post={lastPostTransaction?.PostEntryResponse}
              />  
            }

            {/* {lastPostTransaction && lastPostTransaction?.TxnHashHex &&
              <div>
                Check your last post here: <a href={`https://focus.xyz/post/${lastPostTransaction?.TxnHashHex}`} target="_blank" rel="noreferrer">{lastPostTransaction?.TxnHashHex}</a>
              </div>
            } */}

            {postError && <p className={styles.error}>Error: {postError}</p>}
          </div>
        )}      


        {
          userPublicKey && 
          <Link href={`/${userProfile?.Username || userPublicKey}/settings/posts`}>
            Settings
          </Link>           
        }
    


      </div>
    </Page>
  );
}