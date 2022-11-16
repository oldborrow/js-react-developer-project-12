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
            state.channelId = currentChannelId
        },
        updateState(state, {payload}) {
            const {body, channelId, username} = payload;
            state.messages.push({body: body, channelId: channelId, username: username})
        },
        setCurrentChannel(state, {payload}) {
            state.channelId = payload
        },
        addChannel(state, {payload}) {
            state.channels = [...state.channels, payload]
        },
        deleteChannel(state, {payload}) {
            state.channels = state.channels.filter((el) => el.id !== payload)
            state.messages = state.messages.filter((el) => el.channelId !== payload)
            state.channelId = 1
        }
    }
})

export const { actions } = messengerSlice
export default messengerSlice.reducer