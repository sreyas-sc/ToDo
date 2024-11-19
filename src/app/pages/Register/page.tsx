'use client'
import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import styles from './register.module.css';

type RegistrationStage = 'initial' | 'otp-sent' | 'verifying' | 'registered' | 'error';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<RegistrationStage>('initial');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Simulated OTP send logic
      setStage('otp-sent');
      setErrorMessage('');
    } catch (error) {
      setStage('error');
      setErrorMessage('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setStage('verifying');

    try {
      // Simulated OTP verification logic
      setStage('registered');
    } catch (error) {
      setStage('error');
      setErrorMessage('OTP verification failed');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registrationStages}>
        <div className={`${styles.stage} ${['initial', 'otp-sent', 'verifying', 'registered'].includes(stage) ? styles.active : ''}`}>
          Registration Details
        </div>
        <div className={`${styles.stage} ${['otp-sent', 'verifying', 'registered'].includes(stage) ? styles.active : ''}`}>
          OTP Verification
        </div>
        <div className={`${styles.stage} ${stage === 'registered' ? styles.active : ''}`}>
          Registered
        </div>
      </div>

      <form 
        onSubmit={stage === 'initial' ? handleSendOTP : handleVerifyOTP}
        className={styles.registerForm}
        aria-labelledby="register-heading"
      >
        <h2 id="register-heading" className={styles.formTitle}>
          Create Your TaskMaster Account
        </h2>

        {errorMessage && (
          <div role="alert" className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        {stage === 'initial' && (
          <>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
                placeholder="Choose a username"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Create a strong password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirm-password" className={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="Repeat your password"
              />
            </div>
          </>
        )}

        {stage === 'otp-sent' && (
          <div className={styles.formGroup}>
            <label htmlFor="otp" className={styles.label}>Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className={styles.input}
              placeholder="6-digit OTP"
            />
          </div>
        )}

        {stage === 'initial' && (
          <button 
            type="submit" 
            className={styles.submitButton}
            aria-label="Send OTP for verification"
          >
            Send OTP
          </button>
        )}

        {stage === 'otp-sent' && (
          <button 
            type="submit" 
            className={styles.submitButton}
            aria-label="Verify OTP"
          >
            Verify OTP
          </button>
        )}

        {stage === 'registered' && (
          <div className={styles.successMessage}>
            Registration Successful! Redirecting...
          </div>
        )}

        <div className={styles.formFooter}>
          <p className={styles.loginLink}>
            Already have an account? 
            <Link href="/pages/Login">Log in</Link>
          </p>
        </div>
      </form>
    </div>
  );
}