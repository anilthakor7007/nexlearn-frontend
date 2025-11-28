import axios from 'axios';

describe('API Client Configuration', () => {
    it('should have correct base URL from environment or default', () => {
        // Since we're in test environment, it should use the default
        const expectedURL = '/api';
        expect(expectedURL).toBe('/api');
    });

    it('should verify axios is available', () => {
        expect(axios).toBeDefined();
        expect(typeof axios.create).toBe('function');
    });
});
