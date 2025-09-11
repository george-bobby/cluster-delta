// ImageKit configuration for client-side
export const imagekitConfig = {
  publicKey: process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY || 'public_XA3Jkld7ls8x1CsE5y+gjWj5I4k=',
  urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/georgebobby/cluster-files/',
  authenticationEndpoint: process.env.REACT_APP_BACKEND_URL ? 
    `${process.env.REACT_APP_BACKEND_URL}/imagekit/auth` : 
    'http://localhost:8800/imagekit/auth'
};

// Utility function to get authentication parameters from server
export const getAuthenticationParameters = async () => {
  try {
    const response = await fetch(imagekitConfig.authenticationEndpoint);
    if (!response.ok) {
      throw new Error('Failed to get authentication parameters');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting authentication parameters:', error);
    throw error;
  }
};
