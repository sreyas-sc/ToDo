'use client';
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Import AxiosError for better error handling
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post("https://todo-backend-9bdc.onrender.com/auth/login", {
        email,
        password,
      });

      // Save token and userId to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);

      // Redirect to To do page
      window.location.href = "/pages/Todo";
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle Axios errors
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        // Handle non-Axios errors
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form 
        onSubmit={handleSubmit} 
        className={styles.loginForm}
        aria-labelledby="login-heading"
      >
        <h2 
          id="login-heading" 
          className={styles.formTitle}
        >
          Log In to TaskMaster
        </h2>

        {error && (
          <div 
            role="alert" 
            className={styles.errorMessage}
          >
            {error}
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
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
            className={styles.input}
            placeholder="you@example.com"
          />
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
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
            className={styles.input}
            placeholder="Enter your password"
          />
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
  );
}
