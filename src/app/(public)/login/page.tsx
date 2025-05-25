'use client'

import { useRouter } from "next/navigation"
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

import { useLoginMutation } from "@/features/auth/authApiSlice";
import { setCredentials } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import usePersist from "@/hooks/usePersist";


export default function LoginPage() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!

  const errRef = useRef<HTMLParagraphElement>(null);
  const [errMsg, setErrMsg] = useState('')
  const [, setPersist] = usePersist()
  
  const router = useRouter()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  async function handleLogin(googleData: CredentialResponse): Promise<void> {
    if (!googleData.credential) {
      console.error("No credential received from Google");
      setErrMsg("No credential received from Google")
      errRef.current?.focus()
      return
    }

    try {
      const result = await login({ token: googleData.credential }).unwrap()
      const { access_token } = result
      console.log("Access Token:", access_token)
      dispatch(setCredentials({ access_token }))
      setPersist(true)
      router.push("/home")
    } catch (error: unknown) {
        console.error("Login failed:", error);
      
        if (typeof error === "object" && error !== null && "status" in error) {
          const err = error as { status?: number; data?: { detail?: string } };
      
          if (!err.status) {
            setErrMsg("No server response");
          } else if (err.status === 401) {
            setErrMsg("Unauthorized");
          } else if (err.status === 403) {
            setErrMsg("Only Meltwater users can access this app");
          } else {
            setErrMsg(err.data?.detail || "Login failed");
          }
        } else {
          setErrMsg("An unknown error occurred");
        }
      
        errRef.current?.focus();
      }
    
  }

  function handleFailure(): void {
    setErrMsg("Google login was cancelled or failed")
    errRef.current?.focus()
  }

  const errClass = errMsg ? "text-red-600 text-[15px] mb-4 mt-5 font-bold" : "sr-only"

  // Add custom loading animation later
  if (isLoading) return <p className="text-center mt-10">Loading...</p> 

  return (
    <div className="flex flex-col items-center w-full">
      <Card className="w-full max-w-[450px] min-w-[450px] border-2 border-black mt-20">

        <CardHeader className="flex flex-col items-center">

          <Image
              src="/images/quixote-logo.svg"
              alt="App Logo"
              width={500}
              height={500}
              className="mb-10"
          />

          <CardTitle className="text-xl text-center border-b-2 border-black p-1">
            Continue with your meltwater account
          </CardTitle>

        </CardHeader>

        <CardContent className="flex justify-center items-center w-full p-3">

          <div className="px-3 py-2">

            <GoogleOAuthProvider clientId={CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleLogin}
                  onError={handleFailure} 
                  theme="filled_black" 
                  shape="rectangular"
                  width="350"
                  size="large"
                  ux_mode="popup"  
                  text = "continue_with"               
                />            
            </GoogleOAuthProvider> 

          </div>

        </CardContent>

      </Card>

      <p ref={errRef} className={errClass} aria-live="assertive">
        {errMsg}
      </p>

    </div>
  )
}