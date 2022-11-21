import { configureStore } from '@reduxjs/toolkit';
import messengerReducer from './messengerSlice.js';

export default configureStore({
  reducer: {
    messenger: messengerReducer,
  },
});
