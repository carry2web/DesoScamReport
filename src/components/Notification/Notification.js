// components/Notification/Notification.js
"use client";

import { 
    NotificationDefault, 
    NotificationFollow, 
    NotificationSubmitPost,
    NotificationDiamond 
} from './types/';

export const Notification = ({ notification, postsByHash, profilesByPublicKey }) => {
    const { Metadata } = notification;

    const txnType = Metadata?.TxnType;
    const publicKey = Metadata?.TransactorPublicKeyBase58Check;
    const profile = profilesByPublicKey?.[publicKey];

    const transferMeta = Metadata?.BasicTransferTxindexMetadata;

    // related to SUBMIT_POST notifications
    const { SubmitPostTxindexMetadata: submitMeta } = Metadata || {};
    const submittedPost = postsByHash?.[submitMeta?.PostHashBeingModifiedHex];
    const parentPost = postsByHash?.[submitMeta?.ParentPostHashHex];

    // relatted to Diamond notifications
    const isDiamond =
        transferMeta?.DiamondLevel > 0 &&
        transferMeta?.PostHashHex &&
        transferMeta.PostHashHex.length > 0;    

    switch (txnType) {
        case 'FOLLOW':
            return (
                <NotificationFollow
                    profile={profile}
                    publicKey={publicKey}
                    isUnfollow={Metadata?.FollowTxindexMetadata?.IsUnfollow}
                />
            );
        case 'SUBMIT_POST': 
            return (
                <NotificationSubmitPost
                    profile={profile}
                    publicKey={publicKey}
                    submittedPost={submittedPost}
                    parentPost={parentPost}
                />
            ); 
        case 'SUBMIT_POST': 
            return (
                <NotificationSubmitPost
                    profile={profile}
                    publicKey={publicKey}
                    submittedPost={submittedPost}
                    parentPost={parentPost}
                />
            );      
        case 'BASIC_TRANSFER': {

            if (isDiamond) {
                const post = postsByHash?.[transferMeta.PostHashHex];
                return (
                    <NotificationDiamond
                        profile={profile}
                        publicKey={publicKey}
                        post={post}
                        diamondLevel={transferMeta.DiamondLevel}
                    />
                );
            }

            return <NotificationDefault notification={notification} />;
        }                       
        default:
            return <NotificationDefault notification={notification} />;
    }
};