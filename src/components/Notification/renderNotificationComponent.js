// src/components/Notification/renderNotificationComponent.js
import {
  NotificationDefault,
  NotificationFollow,
  NotificationSubmitPost,
  NotificationDiamond,
  NotificationReaction,
  NotificationTransfer,
  NotificationDaoCoinTransfer,
  NotificationUserAssociation,
  NotificationDaoCoinLimitOrder,
} from './types';

export function renderNotificationComponent({ notification, postsByHash, profilesByPublicKey, key, parentIndex }) {
  const { Metadata } = notification;
  const txnType = Metadata?.TxnType;
  const publicKey = Metadata?.TransactorPublicKeyBase58Check;
  const profile = profilesByPublicKey?.[publicKey];
  const transferMeta = Metadata?.BasicTransferTxindexMetadata;
  const { SubmitPostTxindexMetadata: submitMeta } = Metadata || {};
  const submittedPost = postsByHash?.[submitMeta?.PostHashBeingModifiedHex];
  const submittedPostHex = submitMeta?.PostHashBeingModifiedHex;
  const parentPost = postsByHash?.[submitMeta?.ParentPostHashHex];

  switch (txnType) {
    case 'FOLLOW':
      return (
        <NotificationFollow
          profile={profile}
          publicKey={publicKey}
          isUnfollow={Metadata?.FollowTxindexMetadata?.IsUnfollow}
          key={key}
        />
      );
    case 'SUBMIT_POST':
      return (
        <NotificationSubmitPost
          profile={profile}
          publicKey={publicKey}
          submittedPost={submittedPost}
          submittedPostHex={submittedPostHex}
          parentPost={parentPost}
          key={key}
        />
      );
    case 'BASIC_TRANSFER': {
      const isDiamond =
        transferMeta?.DiamondLevel > 0 &&
        transferMeta?.PostHashHex &&
        transferMeta.PostHashHex.length > 0;
      if (isDiamond) {
        const post = postsByHash?.[transferMeta.PostHashHex];
        return (
          <NotificationDiamond
            profile={profile}
            publicKey={publicKey}
            post={post}
            diamondLevel={transferMeta.DiamondLevel}
            key={key}
          />
        );
      }

      return (
        <NotificationTransfer
          profile={profile}
          publicKey={publicKey}
          nanosAmount={transferMeta?.TotalOutputNanos}
          key={key}
        />
      );
    }
    case 'CREATE_POST_ASSOCIATION': {
      const isReaction =
        Metadata?.CreatePostAssociationTxindexMetadata?.AssociationType === 'REACTION';
      const isFocusTip =
        Metadata?.CreatePostAssociationTxindexMetadata?.AssociationType === 'DIAMOND' &&
        Metadata?.CreatePostAssociationTxindexMetadata?.AppPublicKeyBase58Check ===
          'BC1YLjEayZDjAPitJJX4Boy7LsEfN3sWAkYb3hgE9kGBirztsc2re1N';

      if (isReaction) {
        const post = postsByHash?.[Metadata?.CreatePostAssociationTxindexMetadata?.PostHashHex];
        const reaction = Metadata?.CreatePostAssociationTxindexMetadata?.AssociationValue;
        return (
          <NotificationReaction
            profile={profile}
            publicKey={publicKey}
            post={post}
            reaction={reaction}
            key={key}
          />
        );
      }

      if (isFocusTip) {
        const post = postsByHash?.[Metadata?.CreatePostAssociationTxindexMetadata?.PostHashHex];
        return (
          <NotificationDiamond
            profile={profile}
            publicKey={publicKey}
            post={post}
            isFocusTip={true}
            key={key}
          />
        );
      }

      return <NotificationDefault notification={notification} key={key} />;
    }
    case 'DAO_COIN_TRANSFER': {
      const daoMeta = Metadata?.DAOCoinTransferTxindexMetadata;
      const daoAmountHex = daoMeta?.DAOCoinToTransferNanos;
      const creatorUsername = daoMeta?.CreatorUsername;
      return (
        <NotificationDaoCoinTransfer
          profile={profile}
          publicKey={publicKey}
          daoAmountHex={daoAmountHex}
          creatorUsername={creatorUsername}
          notification={notification}              // <-- Pass the full notification
          profilesByPublicKey={profilesByPublicKey} // <-- Pass mapping for username lookups
          key={key}
        />
      );
    }
    case 'CREATE_USER_ASSOCIATION': {
      const assocMeta = Metadata?.CreateUserAssociationTxindexMetadata;
      return (
        <NotificationUserAssociation
          profile={profile}
          publicKey={publicKey}
          associationType={assocMeta?.AssociationType}
          associationValue={assocMeta?.AssociationValue}
          key={key}
        />
      );
    }
    case 'DAO_COIN_LIMIT_ORDER': {
        const meta = notification?.Metadata?.DAOCoinLimitOrderTxindexMetadata;
        return (
            <NotificationDaoCoinLimitOrder
                profile={profile}
                publicKey={publicKey}
                meta={meta}
                profilesByPublicKey={profilesByPublicKey}
                key={key}
            />
        );
    }
    // Don't handle ATOMIC_TXNS_WRAPPER here; that's handled by Notification.js
    default:
      return <NotificationDefault notification={notification} parentIndex={parentIndex} key={key} />;
  }
}
