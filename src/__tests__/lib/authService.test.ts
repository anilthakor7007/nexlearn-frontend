import { authService } from '@/lib/services/authService';
import api from '@/lib/api';

// Mock the api module
jest.mock('@/lib/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('Auth Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (localStorage.removeItem as jest.Mock).mockClear();
    });

    describe('login', () => {
        it('should call API with correct credentials', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Login successful',
                    data: {
                        user: {
                            _id: '123',
                            email: 'test@example.com',
                            username: 'testuser',
                            firstName: 'Test',
                            lastName: 'User',
                            role: 'student',
                            tenantId: 'tenant123',
                            isEmailVerified: true,
                            createdAt: '2024-01-01',
                            updatedAt: '2024-01-01',
                        },
                        token: 'mock-token',
                    },
                },
            };

            mockedApi.post.mockResolvedValue(mockResponse);

            const credentials = {
                email: 'test@example.com',
                password: 'password123',
            };

            const result = await authService.login(credentials);

            expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', credentials);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('register', () => {
        it('should call API with correct registration data', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Registration successful',
                    data: {
                        user: {
                            _id: '123',
                            email: 'new@example.com',
                            username: 'newuser',
                            firstName: 'New',
                            lastName: 'User',
                            role: 'student',
                            tenantId: 'tenant123',
                            isEmailVerified: false,
                            createdAt: '2024-01-01',
                            updatedAt: '2024-01-01',
                        },
                        token: 'mock-token',
                    },
                },
            };

            mockedApi.post.mockResolvedValue(mockResponse);

            const registerData = {
                email: 'new@example.com',
                username: 'newuser',
                password: 'password123',
                firstName: 'New',
                lastName: 'User',
            };

            const result = await authService.register(registerData);

            expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', registerData);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('getProfile', () => {
        it('should fetch user profile', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        _id: '123',
                        email: 'test@example.com',
                        username: 'testuser',
                        firstName: 'Test',
                        lastName: 'User',
                        role: 'student',
                        tenantId: 'tenant123',
                        isEmailVerified: true,
                        createdAt: '2024-01-01',
                        updatedAt: '2024-01-01',
                    },
                },
            };

            mockedApi.get.mockResolvedValue(mockResponse);

            const result = await authService.getProfile();

            expect(mockedApi.get).toHaveBeenCalledWith('/auth/profile');
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe('logout', () => {
        it('should remove token from localStorage', () => {
            authService.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith('token');
            expect(localStorage.removeItem).toHaveBeenCalledWith('user');
        });
    });
});
