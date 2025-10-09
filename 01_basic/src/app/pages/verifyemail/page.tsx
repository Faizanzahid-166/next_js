'use client'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default  function verifyemail() {

    const router = useRouter()

    const [token, setToken] = useState("")
    const [verifyemail, setVerifyemail] = useState(false)
    const [error, setError] = useState(false)

    const verifyemailUser = async () => {
       try {
         await axios.post("/api/verifyemail", {token})
         setVerifyemail(true)
       } catch (error:any) {
        setError(true)
       }
    }

    useEffect(() => {
        setError(false)
        const tokenurl = window.location.search.split("=")[1]
        setToken(tokenurl || "")

        //commit
        // const {query} = router
        // const tokenurlnextjs = query.token

    }, [])

    useEffect(() => {
        setError(false)
        if (token.length > 0) {
            verifyemailUser()

        }
    },[token])
    
    
  return (
    <div>
        <h1>Verify Email</h1>
        <h2>
        {token ? `${token}` : "no token"}    
        </h2>  

        {verifyemail && (
                <div>
                    <h2>Verified</h2>
                    <Link href="/pages/login">Login</Link>
                </div>
            )
        }
        {error && (
                <div>
                    <h2>Error</h2>
                </div>
            )
        }
    </div>
  )
}


