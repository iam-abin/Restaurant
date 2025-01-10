import { ActionReducerMapBuilder, AsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';

/**
 * Adds standard async thunk cases (pending, fulfilled, rejected) to a Redux reducer.
 * Handles setting the status to 'loading', 'succeeded', or 'failed',
 * and optionally calls a success handler when the action is fulfilled.
 *
 * @param {ActionReducerMapBuilder<StateType>} builder - The Redux builder object used to add cases to the reducer.
 * @param {AsyncThunk<FulfilledPayload, any, { rejectValue: RejectedPayload }>} asyncThunk - The async thunk action creator.
 * @param {((state: Draft<StateType>, action: PayloadAction<FulfilledPayload>) => void) | undefined} [onSuccess] - Optional callback function
 * to execute when the async thunk is fulfilled successfully.
 *
 * @template StateType - The type of the state, expected to have `status` and `error` properties.
 * @template FulfilledPayload - The type of the payload when the async thunk is fulfilled.
 * @template RejectedPayload - The type of the payload when the async thunk is rejected (defaults to `string`).
 *
 * @example
 * addAsyncThunkCases(builder, fetchDataThunk, (state, action) => {
 *   state.data = action.payload;
 * });
 *
 * // In this example, when the fetchDataThunk is fulfilled,
 * // the data will be updated in the state, and the status will be set to 'succeeded'.
 */
export function addAsyncThunkCases<
    StateType extends { status: string; error: string | null },
    FulfilledPayload = void,
    RejectedPayload extends string | null = string,
>(
    builder: ActionReducerMapBuilder<StateType>,
    asyncThunk: AsyncThunk<FulfilledPayload, any, { rejectValue: RejectedPayload }>, // eslint-disable-line @typescript-eslint/no-explicit-any
    onSuccess?: (state: Draft<StateType>, action: PayloadAction<FulfilledPayload>) => void,
) {
    builder
        .addCase(asyncThunk.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(asyncThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            if (onSuccess) {
                onSuccess(state, action);
            }
        })
        .addCase(asyncThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload as RejectedPayload;
        });
}
