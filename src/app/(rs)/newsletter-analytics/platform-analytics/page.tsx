'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
    Select, 
    SelectTrigger, 
    SelectContent, 
    SelectItem, 
    SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useLazyDownloadPlatformAnalyticsQuery } from "@/features/newsletter_analytics/platformAnalyticsApiSlice"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader } from "lucide-react"
 
const formSchema = z.object({
    newsletter_id: z.string().min(5, "Newsletter ID is required"),
    auth_token: z.string().min(10, "Auth token is required"),
    date_range: z.enum(["7d", "1m", "3m", "6m", "allTime"]),
    is_new_version: z.boolean(),
  })

export default function NlPlatformAnalytics() {
    const [downloadAnalytics, { isFetching }] = useLazyDownloadPlatformAnalyticsQuery()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          date_range: "7d",
          newsletter_id: "",
          auth_token: "",
          is_new_version: false,
        },
      })
     
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const blob = await downloadAnalytics(values).unwrap()

            const file = new Blob([blob], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })

            const url = URL.createObjectURL(file)
            const a = document.createElement("a")
            a.href = url
            a.download = `${values.newsletter_id}_analytics.xlsx`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
            toast.success("File generated successfully!")
        } catch (error) {
            console.error("Download error:", error)
            toast.error("Download failed. Please try again.")
        }
    }

    return (
        <div className="max-w-[700px] mx-auto p-6 mt-10 border-1 border-black rounded-sm shadow-md">
            <h2 className="text-2xl font-bold mb-6">Export Newsletter Platform Analytics</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="newsletter_id"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Newsletter ID</FormLabel>
                        <FormControl>
                        <Input placeholder="Enter Newsletter ID" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="auth_token"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Auth Token</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Paste your auth token"
                                className="resize-y min-h-[100px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_new_version"
                    render={({ field }) => (
                        <FormItem className="flex flex-row">
                        <FormControl>
                            <Checkbox
                                className="shadow-md border border-black"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel className="mb-0">Is New Version</FormLabel>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date_range"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a date range" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="1m">Last 1 month</SelectItem>
                            <SelectItem value="3m">Last 3 months</SelectItem>
                            <SelectItem value="6m">Last 6 months</SelectItem>
                            <SelectItem value="allTime">All Time</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button 
                    type="submit" 
                    disabled={isFetching}
                    className="w-[150px]"
                >
                    {isFetching ? <Loader /> : "Download Analytics"}
                </Button>
                </form>
            </Form>
        </div>
    )
}