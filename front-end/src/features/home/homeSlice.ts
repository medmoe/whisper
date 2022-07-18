import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from '../../app/store'
import {counterSlice} from "../counter/counterSlice";


export interface Room {
    owner?: number,
    name: string,
    category: 'buildings' | 'movies' | 'music' | 'travel' | 'food' | 'water' | 'other',
    size: string,
    private: boolean,
    created?: string,
}
export interface User {
    id?: number,
    first_name: string,
    last_name: string,
    email: string,
    username: string,
}
export interface HomeState {
    roomsAreFetched: boolean,
    rooms: Room[],
    user: User,
}

const initialState: HomeState = {
    roomsAreFetched: false,
    rooms: [],
    user : {
        first_name: "",
        last_name: "",
        email: "",
        username: "",

    }
}

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        updateRooms: (state, action: PayloadAction<Room[]>) => {
            state.rooms = action.payload;
        },
        updateRoomsAreFetched: (state) => {
            state.roomsAreFetched = !state.roomsAreFetched
        },
        updateUserData: (state, action:PayloadAction<User>) => {
            state.user = action.payload;
        }
    },
});

export const { updateRooms, updateRoomsAreFetched, updateUserData } = homeSlice.actions
export const selectRooms = (state: RootState) => state.home.rooms;
export const selectRoomsAreFetched = (state: RootState) => state.home.roomsAreFetched;
export const selectUser = (state: RootState) => state.home.user;

export default homeSlice.reducer;