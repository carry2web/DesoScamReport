// Centralized query key registry for all React Query data

export const queryKeys = {
    // User profiles
    profileByUsername: (username) => ['profile-by-username', username],
    // Note: profileByPublicKey is used in both ProfilePage and search input when query is a full public key
    profileByPublicKey: (publicKey) => ['profile-by-publickey', publicKey],
  
    // Posts
    userPosts: (lookupKey) => ['user-posts', lookupKey],       // By username or public key
    singlePost: (postHash) => ['single-post', postHash],       // One post by hash
    postComments: (postHash) => ['comments', postHash],        // Comments for a post

    // Follow feed (posts from followed users)
    followFeedPosts: (publicKey) => ['follow-feed-posts', publicKey], // Feed for a user
  
    // Profile search
    searchProfilesByUsernamePrefix: (query) => ['search-profiles-by-username-prefix', query],
};
  