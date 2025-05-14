import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'

interface AuthState {
    token: string | null
}

const initialState: AuthState = {
    token: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ access_token: string}>) => {
            state.token = action.payload.access_token
        },
        logOut: (state) => {
            state.token = null
        },
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: RootState) => state.auth.token
