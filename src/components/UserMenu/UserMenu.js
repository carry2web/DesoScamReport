"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { MenuItem } from "@/components/MenuItem";

import { useClickOutside } from '@/hooks/useClickOutside';

import { Avatar } from "@/components/Avatar";

import styles from "./UserMenu.module.css";

export const UserMenu = () => {
    const { userPublicKey, login, logout, setActiveUser } = useAuth();
    const { altUserProfiles, isAltUserProfileSLoading, userProfile, isUserProfileLoading } = useUser();

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

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
            <Avatar profile={userProfile} size={38} />
        </div>  

        {isOpen && (
            <div className={styles.dropdown}>

                <div className={styles.loggedUserData}>
                    Logged as:
                    {userPublicKey &&<div><MenuItem>{userPublicKey}</MenuItem></div>}
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
                        <Select
                            value=""
                            onChange={(e) => handleUserSelect(e.target.value)}
                            placeholder="Select alternate user"
                            options={
                                altUserProfiles && altUserProfiles.length > 0
                                ? altUserProfiles.map((user) => ({
                                    value: user.PublicKeyBase58Check,
                                    label: user.ProfileEntryResponse?.Username || user.PublicKeyBase58Check,
                                    }))
                                : [{ value: "", label: "No alt users", disabled: true }]
                            }
                        />                        
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
