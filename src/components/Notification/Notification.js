// components/Notification/Notification.js
"use client";

import { NotificationDefault, NotificationFollow, NotificationSubmitPost } from './types/';

export const Notification = ({ notification, postsByHash, profilesByPublicKey }) => {
    const { Metadata } = notification;
    const txnType = Metadata?.TxnType;
    const publicKey = Metadata?.TransactorPublicKeyBase58Check;
    const profile = profilesByPublicKey?.[publicKey];

    const { SubmitPostTxindexMetadata: submitMeta } = Metadata || {};
    const submittedPost = postsByHash?.[submitMeta?.PostHashBeingModifiedHex];
    const parentPost = postsByHash?.[submitMeta?.ParentPostHashHex];

    switch (txnType) {
        case 'FOLLOW':
            return (
                <NotificationFollow
                    profile={profile}
                    publicKey={publicKey}
                    isUnfollow={Metadata?.FollowTxindexMetadata?.IsUnfollow}
                />
            );
        case 'SUBMIT_POST': {
            return (
                <NotificationSubmitPost
                    profile={profile}
                    publicKey={publicKey}
                    submittedPost={submittedPost}
                    parentPost={parentPost}
                />
            );
        }      
        default:
            return <NotificationDefault notification={notification} />;
    }
};