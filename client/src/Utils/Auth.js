// utils/auth.js
export const isTokenValid = (tokenKey = "token") => {
    const token = localStorage.getItem(tokenKey);
    if (!token) return false;
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  
      if (payload.exp && payload.exp > currentTime) {
        return true; // Token is valid
      } else {
        localStorage.removeItem(tokenKey); // Token expired, remove it
        return false; // Token expired
      }
    } catch (err) {
      console.error("Invalid token format or decoding error:", err); // Log the error
      localStorage.removeItem(tokenKey); // Remove invalid token
      return false; // Invalid token
    }
  };
  
  export default isTokenValid;
  