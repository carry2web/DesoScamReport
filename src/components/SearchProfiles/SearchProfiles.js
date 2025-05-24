'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeSoApi } from '@/api/useDeSoApi';
import { useQuery } from '@tanstack/react-query';
import { isMaybePublicKey } from '@/utils/profileUtils';
import classNames from 'classnames';

import { Input } from '@/components/Input';
import { Dropdown } from "@/components/Dropdown";
import { MarkdownText } from '@/components/MarkdownText';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Avatar } from "@/components/Avatar";
import { queryKeys } from '@/queries';

import styles from './SearchProfiles.module.css';

export const SearchProfiles = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const { getProfiles, getSingleProfile } = useDeSoApi();
    const router = useRouter();

    const containerRef = useRef(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedQuery(query.trim());
        }, 300);
        return () => clearTimeout(delay);
    }, [query]);

    const isPublicKey = isMaybePublicKey(debouncedQuery);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: isPublicKey
        ? queryKeys.profileByPublicKey(debouncedQuery)
        : queryKeys.searchProfilesByUsernamePrefix(debouncedQuery),        
        queryFn: async () => {
            if (isPublicKey) {
              const response = await getSingleProfile({ PublicKeyBase58Check: debouncedQuery });
              if (!response.success || !response.data?.Profile) {
                throw new Error(response.error || 'Profile not found');
              }
              return [response.data.Profile];
            } else {
              const response = await getProfiles({ 
                UsernamePrefix: debouncedQuery,
                AddGlobalFeedBoolean: false,
                FetchUsersThatHODL: false,
                NumToFetch: 10
            });
              if (!response.success) throw new Error(response.error);
              return response.data?.ProfilesFound || [];
            }
        },        
        enabled: !!debouncedQuery,
        staleTime: 30 * 1000,
        cacheTime: 5 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useClickOutside(containerRef, () => {
        setQuery('');
        setDebouncedQuery('');
    });    

    const handleInternalLinkClick = () => {
        // Close search results when internal links are clicked
        setQuery('');
        setDebouncedQuery('');
    };

    const handleProfileClick = (username, event) => {
        // Only navigate if the click wasn't on any interactive element
        if (!event.target.closest('a')) {
            setQuery('');
            setDebouncedQuery('');
            router.push(`/${username}`);
        }
    };

    const handleKeyDown = (username, event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setQuery('');
            setDebouncedQuery('');
            router.push(`/${username}`);
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search profiles..."      
                spellCheck="false" 
            />

            {debouncedQuery && (
                <Dropdown className={styles.dropdown}>
                    {isError ? (
                        <div className={classNames(styles.message, styles.errorMessage)}>
                            {error.message || 'Failed to load profiles'}
                        </div>
                    ) : isLoading ? (
                            <div className={styles.message}>Loading...</div>
                        ) : data?.length > 0 ? (
                            data.map((profile) => (
                                <div
                                    key={profile.PublicKeyBase58Check}
                                    className={styles.item}
                                    onClick={(e) => handleProfileClick(profile.Username, e)}
                                    onKeyDown={(e) => handleKeyDown(profile.Username, e)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View profile of ${profile.Username}`}
                                >
                                    <Avatar profile={profile} size={60} />
                                    <div className={styles.info}>
                                        <div className={styles.username}>@{profile.Username}</div>
                                        {profile.Description && (
                                            <div className={styles.description}>
                                                <MarkdownText 
                                                    text={profile.Description} 
                                                    onInternalLinkClick={handleInternalLinkClick}
                                                /> 
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                        <div className={styles.message}>No profiles found</div>
                    )}
                </Dropdown>
            )}
        </div>
    );
};