import { DESO_API_BASE } from '@/config/desoConfig';

export async function getPostsForPublicKey(params) {
  try {
    const response = await fetch(`${DESO_API_BASE}/get-posts-for-public-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    return response.ok
      ? { success: true, data }
      : { success: false, error: data?.error || 'Unknown API error' };
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Network error',
    };
  }
}
