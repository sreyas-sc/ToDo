'use client';
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Placeholder for authentication logic
      console.log('Login attempt:', { email, password });
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.log('Login error:', err);
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