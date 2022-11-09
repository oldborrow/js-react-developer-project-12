import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    channels: [],
    messages: [],
    channelId: null
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
        },
        updateState(state, {payload}) {
            const {message} = payload;
            console.log(state.messages)
            state.messages.push({body: message, channelId: 1, username: "admin"})
        }
    }
})

export const { actions } = messengerSlice
export default messengerSlice.reducer