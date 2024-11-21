'use client'; 
import React, { useState, FormEvent } from 'react'; // Import React and useState, FormEvent hooks
import Link from 'next/link'; // Import Link component from Next.js
import styles from './login.module.css'; // Import CSS module
import authService from '../../services/authServices'; // Import the refactored auth service
import { validateEmail, validatePassword } from '../../utils/validators';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // ************** Viloation of SRP ************** XXXXXXXXXXX
  // const handleSubmit = async (e: FormEvent) => { // handleSubmit function
  //   e.preventDefault(); // Prevent default form submission
  //   setError(''); // Clear error message

  //   try {
  //     const response = await axios.post("http://localhost:5000/auth/login", { // Send POST request to login endpoint
  //       email,
  //       password,
  //     });

  //     // Save token and userId to localStorage
  //     sessionStorage.setItem("token", response.data.token);
  //     sessionStorage.setItem("userId", response.data.userId);

  //     // Redirect to To do page
  //     window.location.href = "/pages/Todo";
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       // Handle Axios errors
  //       setError(err.response?.data?.message || "Something went wrong. Please try again.");
  //     } else {
  //       // Handle non-Axios errors
  //       setError("An unexpected error occurred. Please try again.");
  //     }
  //     console.error("Login error:", err);
  //   }
  // };
  // ************** Viloation of SRP ************** XXXXXXXXXXX

  // ************** Applying SRP **************
  // Refactor the handleSubmit function to delegate the login to the authService (Single Responsibility Principle).
  //  Created a dedicated utility function to handle the API call. 
  // This isolates the login logic from the component and makes it easier to test.
  const handleSubmit = async (e: FormEvent) => { // handleSubmit function
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    // setError('');

    // Validate inputs
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    if (emailValidationError) setEmailError(emailValidationError);
    if (passwordValidationError) setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      return;
    }

    try {
      const { token, userId } = await authService.login(email, password); // Delegate login to service
      sessionStorage.setItem('token', token); // Save token and userId to sessionStorage
      sessionStorage.setItem('userId', userId); // Save token and userId to sessionStorage
      window.location.href = '/pages/Todo'; // Redirect to To do page
    } catch (err) { // Handle login errors
      // Show specific backend error if available
      const errorMessage =
        (err as any).response?.data?.message || 'An error occurred. Please try again.';
      setGeneralError(errorMessage);
    }
  };

  return (
    <>
      <title>Login</title>
      <meta name='description' content='Login to your account' />
      <div className={styles.loginContainer}>
        <form 
          onSubmit={handleSubmit}  // handleSubmit function to form onSubmit event
          className={styles.loginForm}
          aria-labelledby="login-heading"
        >
          <h2 
            id="login-heading" 
            className={styles.formTitle}
          >
            Log In to TaskMaster
          </h2>

          {generalError && (
            <div role="alert" className={styles.errorMessage}>
              {generalError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label 
              htmlFor="email" 
              className={styles.label}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(''); // Clear email error on change
              }}
              required
              aria-required="true"
              className={styles.input}
              placeholder="you@example.com"
            />
            {emailError && (
              <div id="email-error" role="alert" className={styles.errorText}>
                {emailError}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label 
              htmlFor="password" 
              className={styles.label}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(''); // Clear password error on change
              }}
              required
              aria-required="true"
              className={styles.input}
              placeholder="Enter your password"
            />
            {passwordError && (
              <div id="password-error" role="alert" className={styles.errorText}>
                {passwordError}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            aria-label="Log in to your account"
          >
            Log In
          </button>

          <div className={styles.formFooter}>
            <Link 
              href="/forgot-password" 
              className={styles.forgotPassword}
            >
              Forgot Password?
            </Link>
            <p className={styles.registerLink}>
              No account? 
              <Link href="/pages/Register">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
