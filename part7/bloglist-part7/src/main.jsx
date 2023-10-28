import ReactDOM from 'react-dom/client'
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
    reducer: {
        blogs: blogReducer,
        user: userReducer,
        notifications: notificationReducer,
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)