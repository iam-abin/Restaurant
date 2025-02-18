import { NodeEnvironment } from '../../src/types';
import { checkNodeEnvironment } from '../../src/utils';

describe('checkNodeEnvironment', () => {
    test('returns true for matching environment', () => {
        expect(checkNodeEnvironment(NodeEnvironment.TEST)).toBe(true);
    });

    test('returns false for non-matching environment', () => {
        expect(checkNodeEnvironment(NodeEnvironment.DEVELOPMENT)).toBe(false);
    });
});
