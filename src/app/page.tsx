'use client'
import React from 'react';
import Link from 'next/link';

export default function TodoLanding() {
  return (
    <div 
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-50 dark:bg-gray-900"
      role="main"
      aria-label="Todo App Landing Page"
    >
      <header className="row-start-1 w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">TaskMaster</h1>
        </div>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h2 
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
          aria-describedby="tagline"
        >
          Organize Your Life, One Task at a Time
        </h2>
        <p 
          id="tagline" 
          className="text-gray-600 dark:text-gray-300 max-w-md text-center sm:text-left"
        >
          TaskMaster helps you track, manage, and accomplish your goals with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center sm:justify-start">
            <Link 
            href="/pages/Login" 
            className="w-full sm:w-auto rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Login to TaskMaster"
            >
            Login
            </Link>
          <Link 
            href="/pages/Register" 
            className="w-full sm:w-auto rounded-full border border-blue-600 text-blue-600 px-6 py-3 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 dark:hover:bg-gray-800"
            aria-label="Register for TaskMaster"
          >
            Register
          </Link>
        </div>
      </main>

      <footer 
        className="row-start-3 flex gap-4 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400"
        role="contentinfo"
      >
        <Link href="/privacy" className="hover:underline" aria-label="Privacy Policy">
          Privacy
        </Link>
        <Link href="/terms" className="hover:underline" aria-label="Terms of Service">
          Terms
        </Link>
        <a 
          href="https://github.com/yourtodoapp" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:underline"
          aria-label="Visit our GitHub repository"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}