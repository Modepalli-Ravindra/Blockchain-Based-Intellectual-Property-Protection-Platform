import type { Asset, User, ShareRecord, SharedAsset } from '../types';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // Preserve any custom headers passed in options
  const customHeaders = options.headers || {};
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...customHeaders // Allow custom headers to override defaults
    },
    ...options
  };
  
  // If we're sending FormData, let the browser set the Content-Type with boundary
  if (options.body instanceof FormData) {
    // Remove Content-Type so browser can set it correctly
    delete (config.headers as any)['Content-Type'];
  }
  
  try {
    // Log the request for debugging
    console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the status text
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    // Provide more detailed error information
    console.error('API request failed:', {
      endpoint: `${API_BASE_URL}${endpoint}`,
      error: error,
      message: error.message,
      type: error.constructor.name
    });
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      // Check if it's a network issue or CORS issue
      if (error.message.includes('CORS')) {
        throw new Error('CORS error: Please check that the backend is configured to accept requests from your frontend origin.');
      } else {
        throw new Error('Network error: Failed to connect to the server. Please make sure:\n1. The backend server is running on port 5000\n2. Your network connection is stable\n3. There are no firewall issues blocking the connection');
      }
    }
    
    throw error;
  }
};

// --- Helper Functions ---

const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// --- Core Service Functions ---

/**
 * Hashes a file using the SHA-256 algorithm.
 * @param file The file to hash.
 * @returns A promise that resolves with the hex-encoded hash string.
 */
export const hashFile = async (file: File): Promise<string> => {
  const fileBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
  return bufferToHex(hashBuffer);
};

/**
 * Registers a new user
 * @param name The user's name
 * @param email The user's email
 * @param password The user's password
 * @returns A promise that resolves with the newly created User object.
 */
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    // Store token in localStorage
    localStorage.setItem('authToken', response.token);
    
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      rewards: response.rewards
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logs in a user
 * @param email The user's email
 * @param password The user's password
 * @returns A promise that resolves with the logged in User object.
 */
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Store token in localStorage
    localStorage.setItem('authToken', response.token);
    
    return {
      id: response.id,
      name: response.name,
      email: response.email,
      rewards: response.rewards
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Gets the current user's profile
 * @returns A promise that resolves with the User object.
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await apiRequest('/auth/profile');
  
  return {
    id: response.id,
    name: response.name,
    email: response.email,
    rewards: response.rewards
  };
};

/**
 * Updates the current user's profile
 * @param details The updated user details
 * @returns A promise that resolves with the updated User object.
 */
export const updateUserProfile = async (details: { name: string; email: string }): Promise<User> => {
  const response = await apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(details)
  });
  
  return {
    id: response.id,
    name: response.name,
    email: response.email,
    rewards: response.rewards
  };
};

/**
 * Logs out the current user
 */
export const logoutUser = (): void => {
  localStorage.removeItem('authToken');
};

/**
 * "Registers" a new digital asset by hashing it and storing its metadata in the database.
 * @param assetData The asset metadata (name, description, etc.).
 * @param file The file to register.
 * @returns A promise that resolves with the newly created Asset object.
 */
export const registerAsset = async (
    assetData: Omit<Asset, 'id' | 'hash' | 'timestamp'>,
    file: File
): Promise<Asset> => {
  // Create FormData object
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', assetData.name);
  formData.append('description', assetData.description);
  formData.append('fileType', assetData.fileType);
  
  // Send to backend
  const response = await apiRequest('/assets/register', {
    method: 'POST',
    body: formData
  });
  
  return {
    id: response.id,
    userId: response.userId,
    name: response.name,
    description: response.description,
    fileType: response.fileType,
    hash: response.hash,
    timestamp: response.timestamp,
  };
};

/**
 * Retrieves all assets registered by the current user.
 * @returns A promise that resolves with an array of Asset objects.
 */
export const getUserAssets = async (): Promise<Asset[]> => {
  const response = await apiRequest('/assets/user');
  return response;
};

/**
 * Verifies if a file matches a registered asset for the current user.
 * @param file The file to verify.
 * @returns A promise resolving to an object with verification status and the matched asset if found.
 */
export const verifyAsset = async (file: File): Promise<{ asset: Asset | null; isVerified: boolean }> => {
    const hash = await hashFile(file);
    
    const response = await apiRequest('/assets/verify', {
      method: 'POST',
      body: JSON.stringify({ hash })
    });
    
    return response;
};

/**
 * Shares an asset with another registered user.
 * @param assetId The ID of the asset to share.
 * @param recipientId The ID of the user to share with.
 * @returns A promise that resolves with the new ShareRecord.
 */
export const shareAssetWithUser = async (assetId: string, recipientId: string): Promise<ShareRecord> => {
  const response = await apiRequest('/shares', {
    method: 'POST',
    body: JSON.stringify({ assetId, recipientId })
  });
  
  return {
    id: response.id,
    assetId: response.assetId,
    ownerId: response.ownerId,
    recipientId: response.recipientId,
    timestamp: response.timestamp,
  };
};

/**
 * Retrieves all assets that have been shared with the current user.
 * @returns A promise resolving to an array of SharedAsset objects.
 */
export const getSharedWithUserAssets = async (): Promise<SharedAsset[]> => {
  const response = await apiRequest('/shares/received');
  return response;
};

/**
 * Downloads a shared asset file.
 * @param assetId The ID of the asset to download.
 * @returns A promise resolving to the download information.
 */
export const downloadSharedAsset = async (assetId: string): Promise<any> => {
  // For file downloads, we need to use fetch directly to handle the binary response
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}/shares/download/${assetId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to download shared asset');
  }
  
  return response;
};

/**
 * Downloads an asset file.
 * @param assetId The ID of the asset to download.
 * @returns A promise resolving to the download information.
 */
export const downloadAsset = async (assetId: string): Promise<any> => {
  // For file downloads, we need to use fetch directly to handle the binary response
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}/assets/download/${assetId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to download asset');
  }
  
  return response;
};

export const deleteAsset = async (assetId: string): Promise<{ message: string }> => {
  const response = await apiRequest(`/assets/${assetId}`, {
    method: 'DELETE'
  });
  return response;
};
