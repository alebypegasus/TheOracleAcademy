/**
 * Central API Client for The Oracle Academy
 * Automatically binds Authorization Bearer tokens and handles responses.
 */

const getAuthToken = (): string | null => {
  return localStorage.getItem('oracle_jwt_token');
};

const getCurrentUserId = (): string | null => {
  const userJson = localStorage.getItem('oracle_user');
  if (!userJson) return null;
  try {
    const user = JSON.parse(userJson);
    return user.id ? user.id.toString() : null;
  } catch (e) {
    return null;
  }
};

export const setAuthSession = (token: string, user: any) => {
  localStorage.setItem('oracle_jwt_token', token);
  localStorage.setItem('oracle_user', JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem('oracle_jwt_token');
  localStorage.removeItem('oracle_user');
};

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const userId = getCurrentUserId();
  
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (userId) {
    headers.set('x-user-id', userId);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMsg = `HTTP error! Status: ${response.status}`;
    try {
      const errData = await response.json();
      errMsg = errData.error || errData.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Authentication & Profile Sync
  auth: {
    syncFirebase: (payload: { email: string; name: string; avatar?: string; firebaseUid?: string }) => 
      apiRequest('/api/auth/firebase-sync', {
        method: 'POST',
        body: JSON.stringify(payload)
      }),
    syncUserData: () => apiRequest('/api/user/sync'),
    updateProfile: (profile: any) => apiRequest('/api/profile/update', {
      method: 'POST',
      body: JSON.stringify(profile)
    }),
    updateSettings: (settings: { colorTheme?: string; themePreference?: string }) => apiRequest('/api/settings/update', {
      method: 'POST',
      body: JSON.stringify(settings)
    }),
    updateChallenges: (challenges: any) => apiRequest('/api/challenges/update', {
      method: 'POST',
      body: JSON.stringify(challenges)
    })
  },

  // Courses Saga (including Gemini AI Course Generator)
  courses: {
    list: () => apiRequest<any[]>('/api/courses'),
    get: (id: string) => apiRequest(`/api/courses/${id}`),
    generate: (topic: string) => apiRequest('/api/courses/generate', {
      method: 'POST',
      body: JSON.stringify({ topic })
    }),
    getProgress: (courseId: string) => apiRequest(`/api/courses/progress/${courseId}`),
    updateProgress: (courseId: string, completedLessons: string[], score: number) => apiRequest('/api/courses/progress/update', {
      method: 'POST',
      body: JSON.stringify({ courseId, completedLessons, score })
    }),
    getNodeContent: (nodeId: string) => apiRequest(`/api/courses/node/${nodeId}`),
    saveNodeContent: (nodeId: string, markdownContent: string, courseId: number = 1) => apiRequest(`/api/courses/node/${nodeId}`, {
      method: 'POST',
      body: JSON.stringify({ markdownContent, courseId })
    })
  },

  // Marketplace & Reliquary Shop
  marketplace: {
    listItems: (category?: string) => apiRequest(`/api/marketplace/items${category ? `?category=${encodeURIComponent(category)}` : ''}`),
    getItem: (id: string) => apiRequest(`/api/marketplace/items/${id}`),
    createItem: (itemData: any) => apiRequest('/api/marketplace/items/create', {
      method: 'POST',
      body: JSON.stringify(itemData)
    }),
    updateItem: (id: string, itemData: any) => apiRequest(`/api/marketplace/items/update/${id}`, {
      method: 'POST',
      body: JSON.stringify(itemData)
    }),
    deleteItem: (id: string) => apiRequest(`/api/marketplace/items/delete/${id}`, {
      method: 'DELETE'
    }),
    getSellerProfile: (userId: string) => apiRequest(`/api/marketplace/seller/${userId}`),
    getReviews: (itemId: string) => apiRequest(`/api/marketplace/reviews/${itemId}`),
    submitReview: (itemId: string, rating: number, comment: string) => apiRequest('/api/marketplace/reviews/submit', {
      method: 'POST',
      body: JSON.stringify({ itemId, rating, comment })
    }),
    purchase: (itemIds: string[]) => apiRequest('/api/marketplace/purchase', {
      method: 'POST',
      body: JSON.stringify({ itemIds })
    })
  },

  // Payments / Splits / Withdrawals
  payment: {
    createPreference: (itemIds: string[]) => apiRequest('/api/payments/create-preference', {
      method: 'POST',
      body: JSON.stringify({ itemIds })
    }),
    getTransactions: () => apiRequest('/api/payments/transactions'),
    withdraw: (amount: number, pixKey: string) => apiRequest('/api/payments/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, pixKey })
    })
  },

  // Grimorio
  grimoire: {
    list: () => apiRequest('/api/grimoire'),
    create: (entry: any) => apiRequest('/api/grimoire/create', {
      method: 'POST',
      body: JSON.stringify(entry)
    }),
    update: (entry: any) => apiRequest('/api/grimoire/update', {
      method: 'POST',
      body: JSON.stringify(entry)
    }),
    delete: (id: string) => apiRequest(`/api/grimoire/delete/${id}`, {
      method: 'DELETE'
    })
  },

  // Community Social Network
  community: {
    listPosts: () => apiRequest('/api/community/posts'),
    createPost: (post: { content: string; image?: string }) => apiRequest('/api/community/posts/create', {
      method: 'POST',
      body: JSON.stringify(post)
    }),
    likePost: (postId: string) => apiRequest(`/api/community/posts/like/${postId}`, {
      method: 'POST'
    }),
    addComment: (postId: string, content: string) => apiRequest(`/api/community/posts/comment/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ content })
    }),
    getNews: () => apiRequest('/api/community/news')
  },

  // Workspace integration (Drive / Docs exporting)
  workspace: {
    saveDoc: (title: string, content: string) => apiRequest('/api/workspace/save-doc', {
      method: 'POST',
      body: JSON.stringify({ title, content })
    }),
    saveCertificate: (courseTitle: string, studentName: string) => apiRequest('/api/workspace/save-certificate', {
      method: 'POST',
      body: JSON.stringify({ courseTitle, studentName })
    })
  }
};
