import { apiSlice } from "@/app/api/apiSlice";

export const platformAnalyticsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        downloadPlatformAnalytics: builder.query<Blob, {
            newsletter_id: string
            auth_token: string 
            date_range: string
        }>
        ({
            async queryFn({ newsletter_id, auth_token, date_range }, _queryApi, _extraOptions, fetchWithBQ) {
                const url = `/newsletter-analytics/get-platform-analytics?newsletter_id=${newsletter_id}&auth_token=${auth_token}&date_range=${date_range}`
        
                const response = await fetchWithBQ({
                  url,
                  method: 'GET',
                  responseHandler: (response) => response.blob(), // For file download
                })
        
                if (response.error) return { error: response.error }
                return { data: response.data as Blob }
              }
        }),
            
    })
})


export const {
    useLazyDownloadPlatformAnalyticsQuery
} = platformAnalyticsApiSlice