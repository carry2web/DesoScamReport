"use client";

import { Page } from "@/components/Page";

import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import Link from 'next/link';

import styles from "./page.module.css";

import { PostEditor } from "@/components/PostEditor";

export default function Home() {

  const { 
    userPublicKey, isAuthChecking, 
  } = useAuth();

  const { userProfile } = useUser();

  const isDisabled = !userPublicKey || isAuthChecking;

  return (
    <Page>
      <div className={styles.pageContainer}>

        {/* Public Key Loading State */}
        {isAuthChecking && <div>Checking authentication...</div>}

        { userPublicKey && <PostEditor disabled={isDisabled} />}
      

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