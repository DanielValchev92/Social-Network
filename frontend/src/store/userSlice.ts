import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    userLoggedIn: boolean,
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    image: string,
    occupation: string,
    messagesCount: number,
    likesCount: number
}

const initialState: UserState = {
    userLoggedIn: false,
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    occupation: '',
    messagesCount: 0,
    likesCount: 0
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserLoggedIn: (
            state,
            action: PayloadAction<{ 
                _id: string, 
                firstName: string; 
                lastName: string; 
                email: string, 
                image: string, 
                occupation: string, 
                messagesCount: number, 
                likesCount: number | null | undefined }>
        ) => {
            state.userLoggedIn = true;
            state._id = action.payload._id;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.image = action.payload.image;
            state.occupation = action.payload.occupation;
            state.messagesCount = action.payload.messagesCount;
            state.likesCount = action.payload.likesCount ?? 0;
        },
        logout: (state) => {
            state.userLoggedIn = false;
            state._id = '';
            state.firstName = '';
            state.lastName = '';
            state.email = '';
            state.image = '';
            state.occupation = '';
            state.messagesCount = 0;
            state.likesCount = 0;
        },
        incrementMessagesCount: (state, action: PayloadAction<number>) => {
            state.messagesCount = action.payload;
        },
        incrementLikesCount: (state, action: PayloadAction<number>) => {
            state.likesCount += action.payload;
        },
        setUserImage: (state, action: PayloadAction<string>) => {
            state.image = action.payload;
        },
        setOccupation: (state, action: PayloadAction<string>) => {
            state.occupation = action.payload;
        }
    }
});

export const { setUserLoggedIn, logout, incrementMessagesCount, incrementLikesCount, setUserImage, setOccupation } = userSlice.actions;
export default userSlice.reducer;