import { httpClient } from "../http"

export interface User {
  _id: string
  id: string
  name: string
  email: string
  isAdmin: boolean
  avatar?: string
  verified?: boolean
  provider?: string
  resgisteredDate?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  avatar?: string
}

export interface AuthResponse {
  status: string
  message: string
  user?: User
  token?: string
}

export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await httpClient.post("/api/auth/login", credentials)
    return response.data
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await httpClient.post("/api/auth/register", data)
    return response.data
  },

  // Get current user
  me: async (): Promise<User> => {
    const response = await httpClient.get("/api/user/me")
    return response.data.user
  },

  // Logout
  logout: async (): Promise<void> => {
    await httpClient.post("/api/auth/logout")
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await httpClient.post("/api/auth/forgotpassword", { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await httpClient.post(`/resetpassword/${token}`, { password })
    return response.data
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await httpClient.get("/api/auth/changepassword", {
      params: { password: oldPassword, newpassword: newPassword }
    })
    return response.data
  },
}
