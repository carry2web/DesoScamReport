import { useMemo, useCallback } from "react";
import { createApiHandler } from "./apiDeSoUtils";
import { DESO_API_BASE } from "@/config/desoConfig";

export function useDeSoApi() {
  const baseUrl = DESO_API_BASE;
  const apiRequest = useMemo(() => createApiHandler({ baseUrl }), [baseUrl]);

  const getSingleProfile = useCallback((params) => {
    return apiRequest({
      endpoint: "get-single-profile",
      options: { body: JSON.stringify(params) },
    });
  }, [apiRequest]);

  // this can be used to load all alt users to switch account
  const getUsersStateless = useCallback((params) => {
    return apiRequest({
      endpoint: "get-users-stateless",
      options: { body: JSON.stringify(params) },
    });
  }, [apiRequest]);  

  const getTotalSupply = useCallback(() => {
    return apiRequest({
      endpoint: "total-supply",
      options: { method: "GET" },
    });
  }, [apiRequest]);  

  const getExchangeRate = useCallback(() => {
    return apiRequest({
      endpoint: "get-exchange-rate",
      options: { method: "GET" },
    });
  }, [apiRequest]);    

  const submitPost = useCallback((params) => {
    const {
      UpdaterPublicKeyBase58Check,
      ParentStakeID = "",
      RepostedPostHashHex = "",
      PostHashHexToModify = "",
      Body = "",
      ImageURLs = null,
      VideoURLs = null,
      PostExtraData = null,
      MinFeeRateNanosPerKB,
    } = params;
  
    const payload = {
      UpdaterPublicKeyBase58Check,
      PostHashHexToModify,
      ParentStakeID,
      Title: "",
      BodyObj: {
        Body,
        ImageURLs,
        VideoURLs,
      },
      RepostedPostHashHex,
      PostExtraData,
      Sub: "",
      IsHidden: false,
      MinFeeRateNanosPerKB,
      InTutorial: false,
    };
  
    return apiRequest({
      endpoint: "submit-post",
      options: {
        body: JSON.stringify(payload),
      },
    });
  }, [apiRequest]);

  const getPostsForPublicKey = useCallback((params) => {
    const {
      LastPostHashHex = '',
      MediaRequired = false,
      NumToFetch = 10,
      PublicKeyBase58Check = '',
      ReaderPublicKeyBase58Check = '',
      Username = ''
    } = params;
  
    const payload = {
      LastPostHashHex,
      MediaRequired,
      NumToFetch,
      PublicKeyBase58Check,
      ReaderPublicKeyBase58Check,
      Username
    };

    return apiRequest({
      endpoint: "get-posts-for-public-key",
      options: { 
        body: JSON.stringify(payload), 
      },
    });
  }, [apiRequest]);     

  const getSinglePost = useCallback((params) => {
    const {
      PostHashHex,
      ReaderPublicKeyBase58Check = '',
      FetchParents = false,
      CommentOffset = 0,
      CommentLimit = 20,
      AddGlobalFeedBool = false,
    } = params;
  
    const payload = {
      PostHashHex,
      ReaderPublicKeyBase58Check,
      FetchParents,
      CommentOffset,
      CommentLimit,
      AddGlobalFeedBool,
    };
  
    return apiRequest({
      endpoint: "get-single-post",
      options: {
        body: JSON.stringify(payload),
      },
    });
  }, [apiRequest]);
  
  
  return {
    getSingleProfile,
    getUsersStateless,
    getTotalSupply,
    getExchangeRate,
    submitPost,
    getPostsForPublicKey,
    getSinglePost
  };
}
