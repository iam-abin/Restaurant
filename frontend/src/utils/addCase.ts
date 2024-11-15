import { ActionReducerMapBuilder, AsyncThunk, PayloadAction, Draft } from "@reduxjs/toolkit";

export function addAsyncThunkCases<StateType extends { status: string; error: string | null }>(
    builder: ActionReducerMapBuilder<StateType>,
    asyncThunk: AsyncThunk<any, any, any>,
    onSuccess?: (state: Draft<StateType>, action: PayloadAction<any>) => void // Use Draft<StateType> here
) {
    builder
        .addCase(asyncThunk.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(asyncThunk.fulfilled, (state, action) => {
            state.status = "succeeded";
            if (onSuccess) {
                onSuccess(state, action); // Execute onSuccess if provided
            }
        })
        .addCase(asyncThunk.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload as string;
        });
}
