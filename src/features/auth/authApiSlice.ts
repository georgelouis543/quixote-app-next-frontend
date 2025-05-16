import { apiSlice } from "@/app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

interface AuthTokenResponse {
    access_token: string,
    token_type: string,
    user_email: string,
    user_role: string,
  }
  
interface GoogleLoginToken {
    token: string 
  }


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthTokenResponse, GoogleLoginToken>({
            query: ({ token }) => ({
                url: `/auth/login?token=${encodeURIComponent(token)}`,
                method: 'GET',
            }),
        }),

        sendLogout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'GET',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.error(err)
                }
            },
        }),

        refresh: builder.mutation<AuthTokenResponse, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    const { access_token } = data
                    dispatch(setCredentials({ access_token }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    }),
})
  
export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice