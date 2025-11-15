'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm , } from "react-hook-form"
import * as z  from "zod"
import React, { useEffect, useState } from 'react'
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

function page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingusername, setisCheckingsetUsername] = useState(false)
  const [Issubmit, setIsSubmit] = useState(false)
  const  debounce= useDebounceCallback(setUsername,300)
  const router = useRouter()

  //zod impletation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username:'',
      email:'',
      password:'',
    }
  })

  useEffect(() => {
    const checkingusernameUnique = async  () => {
      if (username) {
        setisCheckingsetUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(response.data.message)
          let message = response.data.message
          setUsername(message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally{
          setisCheckingsetUsername(false)
        }
      }
    }

    checkingusernameUnique()},[username])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
      setIsSubmit(true)
      try {
        const response = await axios.post<ApiResponse>('/api/signup',data)
        console.log(data,"data");

        // ✅ Correct syntax for Sonner
      toast.success(response.data.message || "Signup successful!");
        router.replace(`/verify/${username}`)
        setIsSubmit(false)
        
      } catch (error) {
        console.error("error in signup of user",error);
         const axiosError = error as AxiosError<ApiResponse>;
         let errorMessage = axiosError.response?.data.message
         toast.error(errorMessage);
         setIsSubmit(false)
      }
    }

  return (
    <div className="flex flex-col items-center justify-center mt-20  ">

      <div className="w-full max-w-md  bg-none rounded-xl shadow-md py-2 px-8 ">

     	<h1 className="text-blue-500 text-[28px] font-bold text-center mt-3 py-6" >Sign Up</h1>
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* username------------------------------ */}
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" 
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  debounce(e.target.value)
                }}
                />
              </FormControl>
                {isCheckingusername && <Loader2 className="animate-spin" />}
                <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>test {usernameMessage}</p>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* email--------------- */}
          <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* password */}
         <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={Issubmit}>
            {
                Issubmit ? (
                    <>
                    <Loader2 className="animate-spin" />
                    Please wait
                    </>
                ) : ('Signup')
            }
        </Button>
      </form>
    </Form>
    <div>
        <p> already a member?</p>
        <Link href="/sign-in">Sign in </Link>
    </div>
    </div>
</div>
  )
}

export default page
