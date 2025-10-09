'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React,{useState} from 'react'
import {toast} from 'react-hot-toast'

export default function Profile() {

  const router = useRouter()

  const [data,setData] = useState('nothing')

  const getUserdetail = async () => {
    const res = await axios.post('/api/me')
    console.log(res.data.data._id);
    setData(res.data.data._id)
    
  }

  const logout = async () => {
    try {
      await axios.get('/api/logout')
      toast.success("logout success")
      router.push('/pages/login')


    } catch (error:any) {
      console.log(error.message);
      toast.error(error.message)
      
    }
  }


  return (
      <div className="flex flex-col items-center justify-center mt-20  ">

      <div className="w-full max-w-md  bg-[#292929] rounded-xl shadow-md py-2 px-8 ">

     	<h1 className="text-cyan-600 text-[28px] text-center mt-3 py-6" >Profile page</h1>

      <hr/>

      <h2>{data === "nothing" ? "nothing" : <Link href={`/pages/profile/${data}`}>{data}</Link>}</h2>

      <br/>

      <button  onClick={getUserdetail} className=" bg-green-500 w-1/2 text-white border-0 rounded-md p-2 focus:bg-blue-600 focus:outline-none transition ease-in-out duration-150 ml-22 ">
     Get User Detail
     </button>

     <hr/>
     <br/>


      <div  className="grid gap-10 self-center">
     <button  onClick={logout} className=" bg-cyan-500 w-1/2 text-white border-0 rounded-md p-2 focus:bg-blue-600 focus:outline-none transition ease-in-out duration-150 ml-22 ">
     Logout
     </button>
      </div>
     
      </div>
    </div>
  )
}


