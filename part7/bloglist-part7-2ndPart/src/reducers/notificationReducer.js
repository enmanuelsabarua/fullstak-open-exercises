const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_MESSAGE':
            return { ...state, message: action.payload }
        case 'SET_TYPE':
            return { ...state, type: action.payload }
        default:
            return state;
    }
}

export default notificationReducer;