import Cookies from 'js-cookie';

export const refreshAccessToken = async () => {
  const refresh = Cookies.get('refresh_token');
  if (!refresh) return null;

  try {
    const response = await fetch('https://ravik00111110.pythonanywhere.com/api/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    Cookies.set('access_token', data.access, { expires: 30 });
    return data.access;
  } catch (err) {
    console.error("Token refresh error:", err);
    return null;
  }
};

export const getAuthHeaders = async () => {
    let token = Cookies.get('access_token');
    console.log("🔐 Access token (before refresh):", token);
  
    if (!token) {
      token = await refreshAccessToken();
      console.log("🔄 Refreshed token:", token);
    }
  
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };
  
