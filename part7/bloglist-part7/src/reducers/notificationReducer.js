import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notifications',
    initialState: { type: null, message: null },
    reducers: {
        setNotificationMessage(state, action) {
            return action.payload;
        }
    }
})

export const { setNotificationMessage } = notificationSlice.actions;
export default notificationSlice.reducer;