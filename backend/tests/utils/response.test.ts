import { createSuccessResponse } from '../../src/utils';

describe('createSuccessResponse', () => {
    it('should return an object with success as true and the given message', () => {
        const response = createSuccessResponse('Operation successful');
        expect(response).toEqual({
            success: true,
            message: 'Operation successful',
        });
    });

    it('should include data when provided', () => {
        const response = createSuccessResponse('Data retrieved', { id: 1, name: 'Test' });
        expect(response).toEqual({
            success: true,
            message: 'Data retrieved',
            data: { id: 1, name: 'Test' },
        });
    });

    it('should allow different types for data', () => {
        const response = createSuccessResponse<number[]>('Numbers returned', [1, 2, 3]);
        expect(response).toEqual({
            success: true,
            message: 'Numbers returned',
            data: [1, 2, 3],
        });
    });
});
