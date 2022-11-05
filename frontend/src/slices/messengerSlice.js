import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    channels: [],
    messages: [],
    currentChannelId: null
}

const messengerSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setMessenger(state, { payload }) {
            const {channels, messages, currentChannelId} = payload;
            state.channels = channels
            state.messages = messages
            state.currentChannelId = currentChannelId
        }
    }
})

export const { actions } = messengerSlice
export default messengerSlice.reducer