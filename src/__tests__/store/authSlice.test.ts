import authReducer, {
    loginUser,
    registerUser,
    logout,
    clearError,
} from '@/store/features/auth/authSlice';
import type { User } from '@/types/auth.types';

// Mock the auth service
jest.mock('@/lib/services/authService');

describe('Auth Slice', () => {
    const initialState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    };

    const mockUser: User = {
        _id: '123',
        tenantId: 'tenant123',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
    };

    const mockToken = 'mock-jwt-token';

    beforeEach(() => {
        // Clear localStorage mock
        (localStorage.getItem as jest.Mock).mockClear();
        (localStorage.setItem as jest.Mock).mockClear();
        (localStorage.removeItem as jest.Mock).mockClear();
    });

    describe('Initial State', () => {
        it('should return the initial state', () => {
            expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
        });
    });

    describe('Logout Action', () => {
        it('should handle logout', () => {
            const previousState = {
                user: mockUser,
                token: mockToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

            expect(authReducer(previousState, logout())).toEqual(initialState);
        });
    });

    describe('Clear Error Action', () => {
        it('should clear error', () => {
            const previousState = {
                ...initialState,
                error: 'Some error',
            };

            expect(authReducer(previousState, clearError())).toEqual(initialState);
        });
    });

    describe('Login User Thunk', () => {
        it('should handle loginUser.pending', () => {
            const action = { type: loginUser.pending.type };
            const state = authReducer(initialState, action);

            expect(state.isLoading).toBe(true);
            expect(state.error).toBe(null);
        });

        it('should handle loginUser.fulfilled', () => {
            const action = {
                type: loginUser.fulfilled.type,
                payload: { user: mockUser, token: mockToken },
            };
            const state = authReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.isAuthenticated).toBe(true);
            expect(state.user).toEqual(mockUser);
            expect(state.token).toBe(mockToken);
            expect(state.error).toBe(null);
        });

        it('should handle loginUser.rejected', () => {
            const action = {
                type: loginUser.rejected.type,
                payload: 'Invalid credentials',
            };
            const state = authReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Invalid credentials');
        });
    });

    describe('Register User Thunk', () => {
        it('should handle registerUser.pending', () => {
            const action = { type: registerUser.pending.type };
            const state = authReducer(initialState, action);

            expect(state.isLoading).toBe(true);
            expect(state.error).toBe(null);
        });

        it('should handle registerUser.fulfilled', () => {
            const action = {
                type: registerUser.fulfilled.type,
                payload: { user: mockUser, token: mockToken },
            };
            const state = authReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.isAuthenticated).toBe(true);
            expect(state.user).toEqual(mockUser);
            expect(state.token).toBe(mockToken);
        });

        it('should handle registerUser.rejected', () => {
            const action = {
                type: registerUser.rejected.type,
                payload: 'Registration failed',
            };
            const state = authReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Registration failed');
        });
    });
});
