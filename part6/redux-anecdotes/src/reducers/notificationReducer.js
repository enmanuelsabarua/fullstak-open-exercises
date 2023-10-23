import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotificationMessage(state, action) {
            return action.payload;
        }
    }
});

export const { setNotificationMessage } = notificationSlice.actions;

export const setNotification = (message, time) => {
    return dispatch => {
        dispatch(setNotificationMessage(message));
        setTimeout(() => {
            dispatch(setNotificationMessage(''));
        }, time * 1000);
    }
}

export default notificationSlice.reducer;