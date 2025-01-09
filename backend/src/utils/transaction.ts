import mongoose from 'mongoose';

/**
 * A utility function to handle MongoDB transactions.
 * @param action - A function that contains the transactional logic.
 * @returns The result of the transactional operation.
 */
export const executeTransaction = async <T>(
    action: (session: mongoose.ClientSession) => Promise<T>,
): Promise<T> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await action(session);

        // Commit the transaction
        await session.commitTransaction();
        return result;
    } catch (error) {
        // Rollback the transaction if something goes wrong
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
