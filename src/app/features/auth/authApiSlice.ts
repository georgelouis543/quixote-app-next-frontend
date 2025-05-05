import { apiSlice } from "@/app/api/apiSlice";
import { logOut } from "./authSlice";

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
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
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
        }),
    }),
})
  
  export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
  } = authApiSlice