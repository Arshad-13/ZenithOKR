import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { apiClient } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAppStore();

  const onSubmit = async (data: any) => {
    setServerError(null);
    setIsLoading(true);

    try {
      // FastAPI OAuth2 expects form data, not JSON
      const formData = new URLSearchParams();
      formData.append('username', data.email); // OAuth2 uses 'username' for the email field
      formData.append('password', data.password);

      // 1. Get the JWT Token
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/login`, 
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      const token = loginResponse.data.access_token;
      
      // 2. Fetch the user's profile and role using the new token
      const meResponse = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. Save to Zustand & LocalStorage
      setAuth(meResponse.data, token);

    } catch (error: any) {
      if (error.response?.status === 401) {
        setServerError("Invalid email or password.");
      } else {
        setServerError("Cannot connect to server. Is the backend running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="max-w-md w-full p-8 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
        
        <div className="w-16 h-16 mx-auto bg-primary-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-md">
          A
        </div>
        <h2 className="text-3xl font-bold text-center text-primary-900 dark:text-primary-100 mb-2">
          AtomQuest Portal
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Sign in to access your goal workspace.
        </p>

        {serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200 text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
            <input 
              type="email"
              {...register('email', { required: true })}
              className="w-full p-2.5 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              placeholder="employee@atomquest.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input 
              type="password"
              {...register('password', { required: true })}
              className="w-full p-2.5 rounded-lg bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Demo Accounts: employee@, manager@, admin@ (Password: test1234)
        </div>
      </div>
    </div>
  );
};