import { ActionReducerMapBuilder, AsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';

export function addAsyncThunkCases<
    StateType extends { status: string; error: string | null },
    FulfilledPayload = void,
    RejectedPayload extends string | null = string,
>(
    builder: ActionReducerMapBuilder<StateType>,
    asyncThunk: AsyncThunk<FulfilledPayload, any, { rejectValue: RejectedPayload }>,
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
