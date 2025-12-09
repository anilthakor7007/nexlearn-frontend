// User types
export interface User {
  id: string;
  tenantId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'superadmin' | 'admin' | 'tenant_admin' | 'instructor' | 'student';
  profile?: {
    bio?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  enrolledCourses?: string[];
  createdCourses?: string[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  profile?: {
    bio?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
