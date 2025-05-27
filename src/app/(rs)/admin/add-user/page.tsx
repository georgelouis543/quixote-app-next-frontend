'use client'

import { Button } from "@/components/ui/button"
import { 
  Form,
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useAddNewUserMutation } from "@/features/users/usersApiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  user_email: z.string().min(13, "User Email is required"),
  user_name: z.string().min(5, "Username is required"),
  role: z.enum(["user","admin"])
})

type ValidationError = {
  msg?: string;
  loc?: string[];
  type?: string;
  input?: string;
  ctx?: Record<string, unknown>;
};

export default function AddUserPage() {
  const errRef = useRef<HTMLParagraphElement>(null);
  const [errMsg, setErrMsg] = useState('')
  const router = useRouter()
  
  const [addNewUser, { 
    isLoading, 
    isSuccess }] = useAddNewUserMutation()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_email: "",
      user_name: "",
      role: "user",
    },
  })

  useEffect(() => {
    if (isSuccess) {
        router.push('/admin/view-users')
    }
}, [isSuccess, router])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      await addNewUser(values).unwrap()
      form.reset()
      toast.success("User created successfully!")
    } catch (error: unknown) {
      console.error("Failed to create user:", error)

      if (typeof error === "object" && error !== null && "status" in error) {
        const err = error as { 
          status?: number; 
          data?: { 
            detail?: string 
          } }

        if (!err.status) {
          setErrMsg("No server response");
        } else if (err.status === 400) {
          setErrMsg("Bad Request");
        } else if (err.status === 409) {
          setErrMsg("Username/email already exists");
        } else if (err.status === 422) {
          
          const errDetail = (err.data as 
            { 
              detail?: ValidationError[] 
            }
          )?.detail

          if (Array.isArray(errDetail) && errDetail.length > 0) {
            setErrMsg(errDetail[0]?.msg || "Invalid input");
          } else {
            setErrMsg(err.data?.detail || "Failed to create User!");
          }

        } else {
        setErrMsg("An unknown error occurred");
      } 
    } else {
      setErrMsg("An unknown error occurred");
    }
    errRef.current?.focus();
    toast.error("Failed to create user. Please try again.")
  } // end of catch block
}

  const errClass = errMsg ? 
  "text-red-600 text-[15px] mb-4 mt-5 font-bold text-center" : 
  "sr-only"

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[500px] w-full mx-auto p-6 mt-10 border-1 border-black rounded-sm shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-center underline">
                Register a New User
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                  <FormField
                      control={form.control}
                      name="user_email"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>User Email</FormLabel>
                            <FormControl>
                            <Input placeholder="Please enter a valid user email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="user_name"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                            <Input placeholder="Enter a valid username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assign Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a date range" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                      )}
                  />

                  <Button 
                    className="w-[90px]"
                    type="submit" 
                    disabled={isLoading}>
                    {isLoading ? <Loader /> : "Create"}
                  </Button>
                    
                </form>
              </Form>
      </div>

      <p ref={errRef} className={errClass} aria-live="assertive">
        {errMsg}
      </p>
    
    </div>
  )
}