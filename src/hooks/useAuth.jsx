// src/hooks/useAuth.js
function useAuth() {
  const validateCredentials = (username, password) => {
    return username === "Saiteja" && password === "Saiteja@2025";
  };

  return { validateCredentials };
}

export default useAuth;
