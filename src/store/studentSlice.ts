import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {AppState} from './store';
export interface StudetState {
    name: string;
};

const initialState: StudetState = {
   name: "demo"
};

export const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        setTestState: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        resetTestState(state, action: PayloadAction<{ name: string }>) {
            const { name } = action.payload;
            state.name = name;
           
        }
    }
});

export const {setTestState, resetTestState} = studentSlice.actions;

export const selectStudentState = (state: AppState) => state.student.name;

export default studentSlice.reducer;

