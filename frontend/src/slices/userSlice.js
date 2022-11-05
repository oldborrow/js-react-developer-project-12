import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    login: '',
    token: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, { payload }) {
            const {login, token} = payload;
            state.login = login
            state.token = token
        }
    }
})

export const { actions } = userSlice
export default userSlice.reducer