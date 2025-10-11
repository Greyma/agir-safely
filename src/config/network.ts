// Network configuration (Render only)
export const NETWORK_CONFIG = {
  production: {
    baseUrl: 'https://agir-safely-backend.onrender.com',
    timeout: 10000,
  },
};

// Always use Render URL
export const getNetworkConfig = () => NETWORK_CONFIG.production;

// Helper to test connectivity with timeout
export const testNetworkConnection = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${url}/`, { method: 'GET', signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Network test failed for URL:', url, error);
    return false;
  }
};

// Keep trying Render only (retry loop), but always return the Render URL
export const getBestApiUrl = async (): Promise<string> => {
  const url = NETWORK_CONFIG.production.baseUrl;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const ok = await testNetworkConnection(url);
    if (ok) {
      console.log('Render API reachable:', url);
      return url;
    }
    await new Promise(r => setTimeout(r, 2000)); // wait 2s between tries
  }
  console.warn('Render API not reachable after retries, using it anyway:', url);
  return url;
};