export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email) ? null : "Invalid email format";
  };
  
  export const validatePassword = (password) => {
    return password.length >= 8 ? null : "Password must be at least 8 characters long";
  };
  