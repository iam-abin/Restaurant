import { getPaginationSkipValue, getPaginationTotalNumberOfPages } from '../../src/utils';

describe('Pagination Utilities', () => {
    describe('getPaginationSkipValue', () => {
        const SKIP_VALUE_ERROR_MESSAGE: string = 'Page and limit must be positive integers';

        test('should return correct skip value', () => {
            const result: number = getPaginationSkipValue(1, 10);
            expect(result).toBe(0); // (1 - 1) * 10 = 0

            expect(getPaginationSkipValue(2, 10)).toBe(10);
            expect(getPaginationSkipValue(3, 5)).toBe(10); // (3 - 1) * 5 = 10
            expect(getPaginationSkipValue(4, 20)).toBe(60);
        });

        test('should throw error for non-positive integers', () => {
            expect(() => getPaginationSkipValue(0, 10)).toThrow(SKIP_VALUE_ERROR_MESSAGE);
            expect(() => getPaginationSkipValue(1, 0)).toThrow(SKIP_VALUE_ERROR_MESSAGE);
            expect(() => getPaginationSkipValue(-1, 10)).toThrow(SKIP_VALUE_ERROR_MESSAGE);
            expect(() => getPaginationSkipValue(2.5, 10)).toThrow(SKIP_VALUE_ERROR_MESSAGE);
            expect(() => getPaginationSkipValue(2, 10.5)).toThrow(SKIP_VALUE_ERROR_MESSAGE);
        });
    });

    describe('getPaginationTotalNumberOfPages', () => {
        const TOTAL_PAGES_VALUE_ERROR_MESSAGE: string =
            'docsCount must be a non-negative integer, and limit must be a positive integer';
        test('should return correct total pages', () => {
            expect(getPaginationTotalNumberOfPages(50, 10)).toBe(5); // 50/10 = 5
            expect(getPaginationTotalNumberOfPages(51, 10)).toBe(6);
            expect(getPaginationTotalNumberOfPages(0, 10)).toBe(0);
            expect(getPaginationTotalNumberOfPages(9, 10)).toBe(1); // 9/10 = 0.9 = 1 // ceil to 1
            expect(getPaginationTotalNumberOfPages(100, 25)).toBe(4);
        });

        test('should throw error for invalid input values', () => {
            expect(() => getPaginationTotalNumberOfPages(-10, 10)).toThrow(TOTAL_PAGES_VALUE_ERROR_MESSAGE);
            expect(() => getPaginationTotalNumberOfPages(10, 0)).toThrow(TOTAL_PAGES_VALUE_ERROR_MESSAGE);
            expect(() => getPaginationTotalNumberOfPages(10.5, 10)).toThrow(TOTAL_PAGES_VALUE_ERROR_MESSAGE);
            expect(() => getPaginationTotalNumberOfPages(10, 2.5)).toThrow(TOTAL_PAGES_VALUE_ERROR_MESSAGE);
        });
    });
});
