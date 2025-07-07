export const uiKeys = {
    commentsVisible: (postHash) => ['ui', 'comments-visible', postHash],
    newCommentsVisible: (postHash) => ['ui', 'new-comments-visible', postHash],
    parentPostVisible: (postHash) => ['ui', 'parent-post-visible', postHash],
    rawVisible: (postHash) => ['ui', 'raw-visible', postHash],

    // 🔥 NEW: Like state UI cache per postHash
    postLiked: (postHash) => ['ui', 'post-liked', postHash],    
};