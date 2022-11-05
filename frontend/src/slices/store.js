import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import messengerReducer from './messengerSlice.js'

export default configureStore({
    reducer: {
        messenger: messengerReducer
    }
})