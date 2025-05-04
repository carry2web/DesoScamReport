"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { Button } from "@/components/Button";

import { useClickOutside } from '@/hooks/useClickOutside';

import { avatarUrl } from "@/utils/profileUtils";

import { DefaultAvatar } from '@/assets/icons';

import styles from "./UserMenu.module.css";

export const UserMenu = () => {
    const { userPublicKey, login, logout, setActiveUser } = useAuth();
    const { altUserProfiles, isAltUserProfileSLoading, userProfile, isUserProfileLoading } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const [imageError, setImageError] = useState(false);
    const avatar = avatarUrl(userProfile);

    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const closeDropdown = () => setIsOpen(false);

    const handleUserSelect = (publicKey) => {
        setActiveUser(publicKey);
        closeDropdown();
    };

    const handleLogin = () => {
        login();
        closeDropdown();
    };

    const handleLogout = () => {
        logout();
        closeDropdown();
    };

    
    useClickOutside(containerRef, () => {
        closeDropdown();
    });    

  return (
    <div className={styles.container} ref={containerRef}>

        <div className={styles.start} onClick={toggleDropdown}>
            <div className={styles.avatarFrame}>
            {!avatar || imageError ? (
                <div className={styles.fallbackAvatar}>
                    <DefaultAvatar />
                </div>
            ) : (
                <img
                    src={avatar}
                    alt="User avatar"
                    className={styles.avatarImage}
                    onError={() => setImageError(true)}
                />
            )}
            </div>

        </div>  

        {isOpen && (
            <div className={styles.dropdown}>

                <div className={styles.loggedUserData}>
                    Logged as:
                    {userPublicKey &&<div>{userPublicKey}</div>}
                    <div>
                        { isUserProfileLoading 
                            ?<>Loading...</>
                            :
                            <>
                                {userProfile?.Username
                                ?<>{userProfile.Username}</>
                                :<>No username</>
                                }
                            </>
                        }
                    </div>
                </div>

                <div className={styles.altUserSelector}>
                    <div>
                    {isAltUserProfileSLoading
                        ?<span>Loading...</span>
                        :
                        <select
                            onChange={(e) => handleUserSelect(e.target.value)}
                            defaultValue=""
                        >
                        <option value="" disabled hidden>Select alternate user</option>
                        {altUserProfiles && altUserProfiles.length > 0 ? (
                            altUserProfiles.map((user) => (
                            <option key={user.PublicKeyBase58Check} value={user.PublicKeyBase58Check}>
                                {user.ProfileEntryResponse?.Username || user.PublicKeyBase58Check}
                            </option>
                            ))
                        ) : (
                            <option disabled>No alt users</option>
                        )}
                        </select>         
                    }       
                    </div>
                    <div><Button onClick={handleLogin} variant="secondary">Add User</Button></div>                
                </div>            

                
                <div className={styles.authButtons}>
                    {userPublicKey ? (
                        <Button onClick={handleLogout}>Log out</Button>
                    ) : (
                        <Button onClick={handleLogin}>Log in</Button>
                    )}
                </div>

            </div>
        )}
    </div>
  );
};
