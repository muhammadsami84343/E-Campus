'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    idNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { idNumber, password } = formData;
    
    // Validation
    if (!idNumber.trim() || !password.trim()) {
      setError('Please enter both your username and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulate loading state
    setTimeout(() => {
      // Check credentials
      if (idNumber === 'admin' && password === '@admin') {
        // Show preloader and redirect to dashboard
        setShowPreloader(true);
        setTimeout(() => {
          router.push('/dashboard-home');
        }, 1000);
      } else if (idNumber === 'student' && password === 'student') {
        setShowPreloader(true);
        setTimeout(() => {
          router.push('#');
        }, 1000);
      } else if (idNumber === 'faculty' && password === 'faculty') {
        setShowPreloader(true);
        setTimeout(() => {
          router.push('#');
        }, 1000);
      } else {
        setError('Invalid login!');
        setIsLoading(false);
      }
    }, 500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Preloader */}
      {showPreloader && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.6) 100%)',
          }}
        >
          <div className="relative flex h-[120px] w-[120px] items-center justify-center">
            <div className="arc arc-1"></div>
            <div className="arc arc-2"></div>
            <div className="arc arc-3"></div>
            <div className="preloader-logo z-10 h-[60px] w-[60px] overflow-hidden rounded-xl">
              <img
                src="/assets/favicon.png"
                alt="eCampus Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <main className="relative min-h-screen">
        {/* Full-screen background */}
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/loginbackground.jpg')" }}
          ></div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        </div>

        {/* Content grid on top */}
        <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
          {/* Left / Hero */}
          <section className="relative flex h-64 items-center lg:h-auto">
            <div className="flex h-full items-center px-8 sm:px-12">
              <div className="max-w-xl text-white">
                {/* Logo */}
                <div className="mb-4 inline-flex items-center justify-center">
                  <img
                    src="/assets/Designer.png"
                    alt="eCampus Logo"
                    className="h-8 w-10 object-contain"
                  />
                </div>

                <p className="text-2xl font-semibold sm:text-3xl">Welcome To</p>
                <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
                  eCampus Management System
                </h1>
                <p className="mt-4 max-w-md text-white/80">
                  E-Services Portal for administration.
                </p>
              </div>
            </div>
          </section>

          {/* Right / Sign-in card */}
          <section className="flex items-center justify-center p-6 sm:p-10">
            <div 
              className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white/95 p-8 shadow-xl backdrop-blur-md"
            >
              <header className="mb-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Sign In</h2>
                <p className="mt-1 text-sm text-gray-500">
                  eCampus — Administration Portal
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Username field */}
                <div>
                  <label
                    htmlFor="idNumber"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    autoComplete="username"
                    placeholder="Username"
                    value={formData.idNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, idNumber: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter your username</p>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label="Toggle password visibility"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${!showPassword ? '' : 'opacity-60'}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 5 12 5s8.577 2.51 9.964 6.678c.07.21.07.434 0 .644C20.577 16.49 16.64 19 12 19s-8.577-2.51-9.964-6.678z"
                        />
                        <circle cx="12" cy="12" r="3" strokeWidth="1.8"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-30"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 space-y-1 text-center text-sm text-gray-600">
                <p className="pt-2 text-xs text-gray-500">
                  Best viewed on the latest versions of Chrome, Edge, and Firefox.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}