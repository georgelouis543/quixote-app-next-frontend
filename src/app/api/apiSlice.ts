import { 
    fetchBaseQuery, 
    createApi, 
    type BaseQueryFn, 
    type FetchArgs, 
    type FetchBaseQueryError 
} from '@reduxjs/toolkit/query/react'
import type { RootState } from '@/app/store'
import { setCredentials } from '@/features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }) as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>

interface RefreshResponse {
    access_token: string
  }

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
        let result = await baseQuery(args, api, extraOptions)

        if (result?.error?.status === 403) {
            console.log('sending refresh token')

            // Attempt to refresh token
            const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

            if (refreshResult?.data) {
                const data = refreshResult.data as RefreshResponse
                api.dispatch(setCredentials(data))
                result = await baseQuery(args, api, extraOptions)
            } else {
            if (refreshResult?.error?.status === 403) {
                (refreshResult.error.data as { message?: string }).message = "Your login has expired."
            }
            return refreshResult
            }
        }

    return result
}


export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Newsletter', 'User'],
    endpoints: builder => ({})
})