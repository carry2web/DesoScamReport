"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { useDeSoApi } from "@/api/useDeSoApi";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/queries";
import { Button } from "@/components/Button";
import styles from "./PostEditor.module.css";

export const PostEditor = ({
  mode = "create",
  post = null,
  disabled = false,
  onClose,
  userPublicKey = null,
  userProfile = null,
}) => {
  const auth = useAuth();
  const user = useUser();

  const resolvedUserPublicKey = userPublicKey || auth.userPublicKey;
  const resolvedUserProfile = userProfile || user.userProfile;
  const signAndSubmitTransaction = auth.signAndSubmitTransaction;

  const { submitPost, uploadImage } = useDeSoApi(); // ✅ added uploadImage
  const { showErrorToast, showSuccessToast } = useToast();
  const queryClient = useQueryClient();

  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);

  const [uploadedImages, setUploadedImages] = useState([]); // ✅ track uploaded image URLs

  useEffect(() => {
    if (mode === "quote") {
      console.log("Quote mode - TODO: prefill quoted text from post");
    } else if (mode === "edit") {
      console.log("Edit mode - TODO: load post.Body into editor");
    }
  }, [mode, post]);

  const handlePostChange = (e) => {
    setPostText(e.target.value);
  };

  // ✅ Handle post submission
  const handleSubmitPost = async () => {
    setLoading(true);
    try {
      
      const settings = {
        UpdaterPublicKeyBase58Check: resolvedUserPublicKey,
        BodyObj: { 
          Body: postText,
          ImageURLs: uploadedImages, // ✅ include uploaded images 
        },
        MinFeeRateNanosPerKB: 1500,
      };

      const result = await submitPost(settings);

      if (result.error) {
        showErrorToast(`Failed to publish post: ${result.error}`);
        return setLoading(false);
      }

      if (result.success && result.data?.TransactionHex) {
        //const tx = await signAndSubmitTransaction(result.data.TransactionHex);
        const username = resolvedUserProfile?.Username || resolvedUserPublicKey;

        await queryClient.invalidateQueries({
          queryKey: queryKeys.userPosts(username),
        });

        showSuccessToast(
          <div>
            Post published successfully 🎉 
            <br />
            <Link href={`/${username}/posts/`}>View in Posts</Link>
          </div>,
          { autoClose: 7000 }
        );

        setPostText('');
        
        if (onClose) {
          onClose();
        }        
      }

      setLoading(false);
    } catch (error) {
      const msg = error?.message || 'Error submitting post';
      showErrorToast(`Failed to publish post: ${msg}`);
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const jwt = await auth.getIdentityJWT();
    const publicKey = resolvedUserPublicKey;

    if (!jwt || !publicKey) {
      showErrorToast("Missing auth data. Please login again.");
      return;
    }

    const result = await uploadImage({
      imageFile: file,
      userPublicKey: publicKey,
      jwt,
    });

    console.log("Image upload result:", result);

    if (result.success) {
      const imageUrl = result.data.ImageURL;
      setUploadedImages((prev) => [...prev, imageUrl]); // ✅ append image
      showSuccessToast("Image uploaded!");
    } else {
      showErrorToast(`Image upload failed: ${result.error}`);
    }
  };

  const handleRemoveImage = (url) => {
    setUploadedImages((prev) => prev.filter((img) => img !== url)); // ✅ remove by URL
  };

  return (
    <div className={styles.postContainer}>
      <textarea
        disabled={loading || disabled || !resolvedUserPublicKey}
        value={postText}
        onChange={handlePostChange}
        placeholder={
          resolvedUserPublicKey 
            ? `Write a post as ${resolvedUserProfile?.Username || resolvedUserPublicKey}`
            : "Login to start posting..."
        }
      />
      <Button
        disabled={!postText.trim() || disabled || !resolvedUserPublicKey}
        isLoading={loading}
        onClick={handleSubmitPost}
      >
        {resolvedUserPublicKey ? 'Post to DeSo' : 'Login to Post'}
      </Button>

      {/* ✅ Upload Image Test */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        disabled={!resolvedUserPublicKey}
        style={{ marginTop: '1rem' }}
      />


      {uploadedImages.length > 0 && (
        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {uploadedImages.map((url) => (
            <div key={url} style={{ position: "relative" }}>
              <img
                src={url}
                alt="Uploaded preview"
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }}
              />
              <button
                onClick={() => handleRemoveImage(url)}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#00000063",
                  border: "none",
                  borderRadius: "50%",
                  color: "white",
                  cursor: "pointer",
                  width: 20,
                  height: 20,
                  lineHeight: "16px",
                  fontSize: 12,
                  padding: 0,
                }}
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}



    </div>
  );
};



// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useUser } from "@/context/UserContext";
// import { useDeSoApi } from "@/api/useDeSoApi";
// import { useToast } from "@/hooks/useToast";
// import { useQueryClient } from "@tanstack/react-query";
// import { queryKeys } from "@/queries";
// import { Button } from "@/components/Button";
// import styles from "./PostEditor.module.css";

// export const PostEditor = ({
//   mode = "create",
//   post = null,
//   disabled = false,
//   onClose,
//   userPublicKey = null,
//   userProfile = null,
// }) => {
//   const auth = useAuth();
//   const user = useUser();

//   const resolvedUserPublicKey = userPublicKey || auth.userPublicKey;
//   const resolvedUserProfile = userProfile || user.userProfile;
//   const signAndSubmitTransaction = auth.signAndSubmitTransaction;

//   const { submitPost } = useDeSoApi();
//   const { showErrorToast, showSuccessToast } = useToast();
//   const queryClient = useQueryClient();

//   const [postText, setPostText] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (mode === "quote") {
//       console.log("Quote mode - TODO: prefill quoted text from post");
//     } else if (mode === "edit") {
//       console.log("Edit mode - TODO: load post.Body into editor");
//     }
//   }, [mode, post]);

//   const handlePostChange = (e) => {
//     setPostText(e.target.value);
//   };

//   const handleSubmitPost = async () => {
//     setLoading(true);
//     try {
//       const settings = {
//         UpdaterPublicKeyBase58Check: resolvedUserPublicKey,
//         BodyObj: { Body: postText },
//         MinFeeRateNanosPerKB: 1500,
//       };

//       const result = await submitPost(settings);

//       if (result.error) {
//         showErrorToast(`Failed to publish post: ${result.error}`);
//         return setLoading(false);
//       }

//       if (result.success && result.data?.TransactionHex) {
//         const tx = await signAndSubmitTransaction(result.data.TransactionHex);
//         const username = resolvedUserProfile?.Username || resolvedUserPublicKey;

//         await queryClient.invalidateQueries({
//           queryKey: queryKeys.userPosts(username),
//         });

//         showSuccessToast(
//           <div>
//             Post published successfully 🎉 
//             <br />
//             <Link href={`/${username}/posts/`}>View in Posts</Link>
//           </div>,
//           { autoClose: 7000 }
//         );

//         setPostText('');
        
//         if (onClose) {
//           onClose();
//         }        
//       }

//       setLoading(false);
//     } catch (error) {
//       const msg = error?.message || 'Error submitting post';
//       showErrorToast(`Failed to publish post: ${msg}`);
//       setLoading(false);
//     }
//   };

//   const testJWT = async () => {
//     const jwt = await auth.getIdentityJWT();
//     if (jwt) {
//       console.log("JWT:", jwt);
//       showSuccessToast("JWT retrieved successfully! Check console for details.");
//     } else {
//       showErrorToast("Failed to retrieve JWT.");
//     }
//   }

//   return (
//     <div className={styles.postContainer}>
//       <textarea
//         disabled={loading || disabled || !resolvedUserPublicKey}
//         value={postText}
//         onChange={handlePostChange}
//         // placeholder={`Write a post as ${resolvedUserProfile?.Username || resolvedUserPublicKey}`}
//         placeholder={
//           resolvedUserPublicKey 
//             ? `Write a post as ${resolvedUserProfile?.Username || resolvedUserPublicKey}`
//             : "Login to start posting..."
//         }
//       />
//       <Button
//         disabled={!postText.trim() || disabled || !resolvedUserPublicKey}
//         isLoading={loading}
//         onClick={handleSubmitPost}
//       >
//         {resolvedUserPublicKey ? 'Post to DeSo' : 'Login to Post'}
//       </Button>
//       <Button
//         variant="secondary"
//         onClick={testJWT}
//       >
//         Test JWT  
//       </Button>
//     </div>
//   );
// };