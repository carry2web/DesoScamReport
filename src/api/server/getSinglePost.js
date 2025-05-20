import { DESO_API_BASE } from '@/config/desoConfig';

export async function getSinglePost(params) {
  try {
    const response = await fetch(`${DESO_API_BASE}/get-single-post`, {
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