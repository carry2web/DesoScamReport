"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { SearchProfiles } from "@/components/SearchProfiles";

export const Navbar = () => {

  const { userPublicKey, login, logout, setActiveUser, isUserPublicKeyLoading } = useAuth();

  const { altUserProfiles, isAltUserProfileSLoading } = useUser();

  return (
    <nav className={styles.container}>
      <div>
        <Link href="/" className={styles.logo}>Home</Link>
        {/* -|-
        <Link href="/brootle" className={styles.logo}>brootle</Link>-|-
        <Link href="/brootlef" className={styles.logo}>brootlef</Link>-|-
        <Link href="/nader" className={styles.logo}>nader</Link>-|-
        <Link href="/nader/posts" className={styles.logo}>nader posts</Link>-|-
        <Link href="/brootlef/posts" className={styles.logo}>brootlef posts</Link> */}
      </div>

      <div>
        <SearchProfiles />
      </div>

      <div className={styles.auth}>
        <div>
          {isAltUserProfileSLoading
            ?<span>Loading...</span>
            :
            <select
              onChange={(e) => {
                const selectedKey = e.target.value;
                if (selectedKey) setActiveUser(selectedKey);
              }}
              defaultValue=""
            >
              <option value="" disabled>Select alternate user</option>
              {altUserProfiles && altUserProfiles.length > 0 ? (
                altUserProfiles.map((user) => (
                  <option key={user.PublicKeyBase58Check} value={user.PublicKeyBase58Check}>
                    {user.ProfileEntryResponse?.Username || user.PublicKeyBase58Check}
                  </option>
                ))
              ) : (
                <option disabled>No alternate users</option>
              )}
            </select>         
          }        
        </div>
        <div><button onClick={login} disabled={isUserPublicKeyLoading}>Add User</button></div>
        <div>
          {userPublicKey ? (
            <button onClick={logout} disabled={isUserPublicKeyLoading}>Log out</button>
          ) : (
            <button onClick={login} disabled={isUserPublicKeyLoading}>Log in</button>
          )}
        </div>
      </div>
    </nav>
  );
};
