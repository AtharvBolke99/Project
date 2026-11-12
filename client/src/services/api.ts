// Determine API Base URL dynamically (supports build-time VITE_API_URL, runtime localStorage, or URL param)
export const getApiBase = (): string => {
  // 1. Build-time environment variable (Render Static Site / Vite)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const clean = envUrl.trim().replace(/\/$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // 2. Runtime override via URL query parameter or localStorage (allows quick live linking)
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryApi = urlParams.get('backend_url') || urlParams.get('api_url');
      if (queryApi && queryApi.startsWith('http')) {
        const clean = queryApi.trim().replace(/\/$/, '');
        localStorage.setItem('conceptifyyy_api_url', clean);
        return clean.endsWith('/api') ? clean : `${clean}/api`;
      }

      const stored = localStorage.getItem('conceptifyyy_api_url');
      if (stored && stored.trim() !== '' && stored.startsWith('http')) {
        const clean = stored.trim().replace(/\/$/, '');
        return clean.endsWith('/api') ? clean : `${clean}/api`;
      }
    } catch {
      // Ignore in SSR or restricted storage environments
    }
  }

  // 3. Seamless Production Auto-Binding for Render (Connects frontend to live backend automatically)
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://project-backend-objs.onrender.com/api';
  }

  return '/api';
};

export const API_BASE = getApiBase();

/**
 * Returns full API URL for custom fetch or navigation downloads
 */
export const getApiUrl = (endpoint: string = ''): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${getApiBase()}${cleanEndpoint}`;
};

/**
 * Returns full backend asset URL for uploads or thumbnails
 */
export const getUploadUrl = (pathStr?: string): string => {
  if (!pathStr) return '';
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  const cleanPath = pathStr.startsWith('/') ? pathStr : `/${pathStr}`;
  const base = getApiBase();
  if (base.startsWith('http')) {
    const origin = base.replace(/\/api$/, '');
    return `${origin}${cleanPath}`;
  }
  return cleanPath;
};

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('conceptifyyy_token');
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers
      });

      // Safely read response text first to guard against empty bodies and non-JSON responses
      const rawText = await response.text();
      let data: any = null;

      if (rawText && rawText.trim().length > 0) {
        try {
          data = JSON.parse(rawText);
        } catch (jsonErr) {
          console.warn(`Non-JSON response received from [${options.method || 'GET'} ${endpoint}]:`, rawText);
          throw new Error(
            response.ok
              ? 'Backend returned an invalid non-JSON response.'
              : `Server error (${response.status}): ${rawText.slice(0, 100)}`
          );
        }
      }

      if (!response.ok) {
        const errorMsg = data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      // If HTTP 200/204 but body was completely empty (e.g. static host proxy returning empty body)
      if (!data) {
        if (endpoint.startsWith('/auth') || endpoint.startsWith('/store') || endpoint.startsWith('/user') || endpoint.startsWith('/dsa')) {
          throw new Error(
            'Backend API did not respond with data. If you are on Render, please set the VITE_API_URL environment variable in your frontend settings to point to your backend URL.'
          );
        }
        return { success: true } as ApiResponse<T>;
      }

      return data;
    } catch (error: any) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
      throw error;
    }
  }

  public get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  public async postFormData<T = any>(
    endpoint: string, 
    formData: FormData, 
    onProgress?: (percent: number) => void
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const url = `${getApiBase()}${endpoint}`;

    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            const rawText = xhr.responseText;
            let data: any = null;
            if (rawText && rawText.trim().length > 0) {
              data = JSON.parse(rawText);
            }
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data || { success: true });
            } else {
              const errorMsg = data?.message || `Upload failed with status ${xhr.status}`;
              reject(new Error(errorMsg));
            }
          } catch (e: any) {
            reject(new Error(e.message || 'Failed to parse upload response'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during file upload. Please check your connection.'));
        };

        xhr.ontimeout = () => {
          reject(new Error('File upload timed out. Please try again.'));
        };

        xhr.send(formData);
      });
    }

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers, // Browser automatically sets Content-Type multipart/form-data with boundary
        body: formData
      });

      const rawText = await response.text();
      let data: any = null;

      if (rawText && rawText.trim().length > 0) {
        data = JSON.parse(rawText);
      }

      if (!response.ok) {
        const errorMsg = data?.message || `Upload failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data || { success: true };
    } catch (error: any) {
      console.error(`Upload error on [POST ${endpoint}]:`, error);
      throw error;
    }
  }
}

export const api = new ApiClient();
