// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => {
    const mockPush = jest.fn();
    const mockReplace = jest.fn();
    const mockPrefetch = jest.fn();
    const mockBack = jest.fn();

    return {
        useRouter: jest.fn(() => ({
            push: mockPush,
            replace: mockReplace,
            prefetch: mockPrefetch,
            back: mockBack,
        })),
        usePathname: jest.fn(() => ''),
        useSearchParams: jest.fn(() => new URLSearchParams()),
    };
});

// Mock localStorage with proper jest.fn()
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});
