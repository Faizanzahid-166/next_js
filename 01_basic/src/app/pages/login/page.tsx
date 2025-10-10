'use client'
import React,{use, useEffect, useState} from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useRouter, } from 'next/navigation'
import Link from 'next/link'



export default function Login() {
  const router = useRouter()

  const [user, setUser] = useState({
    email: '',
    password: '',
  })

  const [button, setButton] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSignup = async() => {
    try {
      setLoading(true)
      const reponse = await axios.post("/api/login", user)
      console.log("suucess", reponse.data);

      router.push('/pages/profile')
      
    } catch (error:any) {
      console.log("login failed");
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length >0 ) {
      setButton(false)
    }else {
      setButton(true)
    }
  }, [user])

  return (
    <div className="flex flex-col items-center justify-center mt-20  ">

      <div className="w-full max-w-md  bg-[#292929] rounded-xl shadow-md py-2 px-8 ">

     	<h1 className="text-green-500 text-[28px] text-center mt-3 py-6" >{loading ? "Processing" : "Login"}</h1>

      <div  className="grid gap-10 self-center">

        <input value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} type="email" placeholder="Email" required className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none 
			              transition ease-in-out duration-150 placeholder-gray-300 "/>

        <input value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} type="password" placeholder="Password"  required  className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none 
			              transition ease-in-out duration-150 placeholder-gray-300 "/>

        <button className=" bg-cyan-500 w-1/2 text-white border-0 rounded-md p-2 focus:bg-blue-600 focus:outline-none transition ease-in-out duration-150 ml-22 " onClick={onSignup}>
        {button ? "No Login" : "Login"}
        </button>
        <Link href="/pages/signup">Visit Signup page</Link>
      </div>
     
      </div>
    </div>
  )
}


