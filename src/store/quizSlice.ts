import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './store';
import jwtDecode from 'jwt-decode';

export interface Quizzes {
    subject: any;
    questions: any
};

const initialState: any = [
    {
        subject: 'Science',
        questions: [
            {
                question: 'Question 1: What is the capital of France?',
                options: ['Paris', 'Berlin', 'Rome', 'Madrid'],
                correctAnswer: 'Paris',
            },
            {
                question: 'Question 2: What is the capital of France?',
                options: ['Paris', 'Berlin', 'Rome', 'Madrid'],
                correctAnswer: 'Paris',
            },
            {
                question: 'Question 3: What is the capital of France?',
                options: ['Paris', 'Berlin', 'Rome', 'Madrid'],
                correctAnswer: 'Paris',
            }
        ]
    },
    {
        subject: 'Mathematics',
        questions: [
            {
                question: 'Question 1: What is the capital of France?',
                options: ['Paris', 'Berlin', 'Rome', 'Madrid'],
                correctAnswer: 'Paris',
            },
            {
                question: 'Question 2: What is the capital of France?',
                options: ['Paris', 'Berlin', 'Rome', 'Madrid'],
                correctAnswer: 'Paris',
            },
            {
                question: 'Question 3: What is the capital of France?',
                options: ['Paris', 'Berlin', 'Rome', 'Madrid'],
                correctAnswer: 'Paris',
            }
        ]
    }
]


export const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        setQuizState: (state, action: PayloadAction<boolean>) => {
            //state = Object.assign(state, action.payload)
        },
        clearQuizState: (state, action: PayloadAction<boolean>) => {
            //state = Object.assign(state, action.payload)
        }
    }
});

export const {setQuizState} = quizSlice.actions;

export const selectQuizState = (state: AppState) => state.quiz;

export default quizSlice.reducer;

