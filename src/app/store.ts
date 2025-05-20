import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { apiSlice } from "./api/apiSlice"
import authReducer from '../features/auth/authSlice'
import { platformAnalyticsApiSlice } from "@/features/newsletter_analytics/platformAnalyticsApiSlice"

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    `${platformAnalyticsApiSlice.reducerPath}/executeQuery/fulfilled`,
                    `${platformAnalyticsApiSlice.reducerPath}/executeQuery/pending`,
                    `${platformAnalyticsApiSlice.reducerPath}/executeQuery/rejected`,
                ],
                ignoredPaths: [`${platformAnalyticsApiSlice.reducerPath}.queries`],
            },
        }).concat(apiSlice.middleware),
    devTools: true
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch