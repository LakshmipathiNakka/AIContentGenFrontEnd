// src/utils/auth.ts

import Cookies from 'js-cookie';

// Function to check if the token is expired
export const checkIfTokenExpired = (token: string) => {
  const decoded = decodeJwt(token);
  const currentTime = Date.now() / 1000; // in seconds
  return decoded.exp < currentTime; // Check expiration time (exp is in seconds)
};

// Decode JWT token
export const decodeJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decoded = JSON.parse(window.atob(base64));
  return decoded;
};

// Get auth headers, refresh the token if expired
export const getAuthHeaders = async () => {
  let accessToken = Cookies.get('access_token');
  if (!accessToken) {
    throw new Error('Access token is missing.');
  }

  const isExpired = checkIfTokenExpired(accessToken);
  if (isExpired) {
    // Refresh the access token using the refresh token
    accessToken = await refreshAccessToken();
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

// Refresh access token using the refresh token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refresh_token'); // Retrieve refresh token from cookies

    // Check if refresh token is available
    if (!refreshToken) {
      throw new Error("No refresh token found.");
    }

    // Send POST request to refresh the access token
    const response = await fetch("https://ravik00111110.pythonanywhere.com/api/auth/token/refresh/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,  // Ensure 'refresh' is the key used by the backend
      }),
    });

    const textResponse = await response.text();
    console.log("Response from refresh token API:", textResponse);

    if (response.ok) {
      const data = JSON.parse(textResponse); // Parse JSON response

      if (data.access) {
        Cookies.set('access_token', data.access, { expires: 30 }); // Set new access token in cookies
        return data.access; // Return the new access token
      } else {
        throw new Error("Missing access token in response.");
      }
    } else {
      if (textResponse.includes('Token is expired')) {
        // Token is expired, log the user out
        logoutUser();
      }

      throw new Error(`Failed to refresh access token: ${textResponse}`);
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Unable to refresh the access token.");
  }
};

// Logout function to handle token expiration errors
const logoutUser = () => {
  // Clear the access token and refresh token
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');

  // Remove authentication status from localStorage
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');

  // Redirect to login page
  window.location.href = "/login";  // Or use navigate('/login') if using react-router
};
