'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm , } from "react-hook-form"
import * as z  from "zod"
import React, { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/schemas/signupSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingusername, setisCheckingsetUsername] = useState(false)
  const [Issubmit, setIsSubmit] = useState(false)
  const  debounceusername= useDebounceValue(username,300)
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
      if (debounceusername) {
        setisCheckingsetUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debounceusername}`)
          setUsername(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally{
          setisCheckingsetUsername(false)
        }
      }
    }

    checkingusernameUnique()},[debounceusername])

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
    <div>
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
                  setUsername(e.target.value)
                }}
                />
              </FormControl>
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
        <Button type="submit" disabled={Issubmit}>Sigup</Button>
      </form>
    </Form>
    </div>
  )
}

export default page
