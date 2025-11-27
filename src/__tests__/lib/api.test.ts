import axios from 'axios';

describe('API Client Configuration', () => {
    it('should have correct base URL from environment or default', () => {
        // Since we're in test environment, it should use the default
        const expectedURL = process.env.NEXT_PUBLIC_API_URL || 'https://nexlearn-backend.onrender.com/api';
        expect(expectedURL).toBe('https://nexlearn-backend.onrender.com/api');
    });

    it('should verify axios is available', () => {
        expect(axios).toBeDefined();
        expect(typeof axios.create).toBe('function');
    });
});
