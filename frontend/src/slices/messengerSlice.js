import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  messages: [],
  channelId: null,
};

const messengerSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMessenger(state, { payload }) {
      const { channels, messages, currentChannelId } = payload;
      // eslint-disable-next-line no-param-reassign
      state.channels = channels;
      // eslint-disable-next-line no-param-reassign
      state.messages = messages;
      // eslint-disable-next-line no-param-reassign
      state.channelId = currentChannelId;
    },
    updateState(state, { payload }) {
      const { body, channelId, username } = payload;
      state.messages.push({ body, channelId, username });
    },
    setCurrentChannel(state, { payload }) {
      // eslint-disable-next-line no-param-reassign
      state.channelId = payload;
    },
    addChannel(state, { payload }) {
      // eslint-disable-next-line no-param-reassign
      state.channels = [...state.channels, payload];
    },
    deleteChannel(state, { payload }) {
      // eslint-disable-next-line no-param-reassign
      state.channels = state.channels.filter((el) => el.id !== payload);
      // eslint-disable-next-line no-param-reassign
      state.messages = state.messages.filter((el) => el.channelId !== payload);
      // eslint-disable-next-line no-param-reassign
      state.channelId = 1;
    },
  },
});

export const { actions } = messengerSlice;
export default messengerSlice.reducer;
