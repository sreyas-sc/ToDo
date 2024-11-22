'use client'
import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // Changed from next/router
import axios from 'axios';
import styles from './register.module.css';

type RegistrationStage = 'initial' | 'otp-sent' | 'verifying' | 'registered' | 'error';

interface Errors {
  email?: string;
  otp?: string;
  general?: string;
}

export default function Register() {
  const router = useRouter();
  // const dispatch = useDispatch();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<RegistrationStage>('initial');
  const [errors, setErrors] = useState<Errors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    if (password !== confirmPassword) {
      setErrors({ ...errors, general: "Passwords do not match" });
      return false;
    }
    return true;
  };

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log('Sending OTP...');
      await axios.post("http://localhost:5000/auth/send-otp", { email });
      setStage('otp-sent');
      setErrors({});
      sessionStorage.setItem("userEmail", email);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setStage('error');
      setErrors({ ...errors, general: 'Failed to send OTP' });
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    setStage("verifying");
  
    try {
      const email = sessionStorage.getItem("userEmail");
      if (!email || !otp) {
        throw new Error("Email or OTP is missing.");
      }
      // http://localhost:5000/auth/verify-otp
      // https://todo-backend-9bdc.onrender.com
      const response = await axios.post("http://localhost:5000/auth/verify-otp", {
        email,
        otp,
        username, 
        password, 
      });
  
      if (response.data.success) {
        sessionStorage.removeItem("userEmail");
        setSuccessMessage("Registration Successful!");
        setStage("registered");
        localStorage.setItem("userEmail", email);
        setTimeout(() => {
          router.push("/pages/Todo"); // Redirect after success
        }, 2000);
      } else {
        setStage("otp-sent");
        setErrors({ ...errors, otp: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setStage("error");
      setErrors({ ...errors, otp: "OTP verification failed" });
    }
  };
  

  return (
    <>
      <title>Register</title>
      <meta name="description" content="Create your TaskMaster account to organize and manage tasks effectively. Enter your details and verify your email with OTP to get started!" />
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

          {(errors.general || errors.email || errors.otp) && (
            <div role="alert" className={styles.errorMessage}>
              {(errors.general ?? errors.email) ?? errors.otp}
            </div>
          )}

          {successMessage && (
            <div className={styles.successMessage}>
              {successMessage}
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
    </>
  );
}
