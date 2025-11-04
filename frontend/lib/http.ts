import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import env from "./env"

// API Error class for normalized error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Create axios instance with base configuration
const createHttpClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Important for httpOnly cookies
  })

  // Request interceptor to attach tokens
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Access token will be sent via httpOnly cookie automatically
      // If you need to add additional headers, do it here
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

      // Handle 401 errors (Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Try to refresh token
          // The backend should have a refresh endpoint that uses refresh token from httpOnly cookie
          await instance.post("/api/auth/refresh")
          
          // Retry original request
          return instance(originalRequest)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
          return Promise.reject(refreshError)
        }
      }

      // Normalize error response
      const apiError = new ApiError(
        error.response?.status || 500,
        (error.response?.data as any)?.message || error.message || "An error occurred",
        (error.response?.data as any)?.errors
      )

      return Promise.reject(apiError)
    }
  )

  return instance
}

// Main API client for backend
export const httpClient = createHttpClient(env.NEXT_PUBLIC_API_URL)

// Separate client for vector search service if different
export const vectorClient = env.NEXT_PUBLIC_VECTORS_URL 
  ? createHttpClient(env.NEXT_PUBLIC_VECTORS_URL)
  : httpClient

export default httpClient
