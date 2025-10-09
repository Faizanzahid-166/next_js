import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/user.model'
import { NextResponse, NextRequest } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request:NextRequest) {
    try {
         const reqBody = await request.json()
       const {email, password} = reqBody
       //validation
       console.log(reqBody);

       const user =  await User.findOne({email})

       if (!user){
        return NextResponse.json(
            {error: "user does not exits"},
            {status:400}
        )
       }

       console.log("user exits");

       const validPassword =  await bcryptjs.compare(password, user.password)
       
       if(!validPassword){
         return NextResponse.json(
        {error: "check your password"},
        {status: 400}
         )
       }

       const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email
       }

       const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn:'1h'})

       const reponse = NextResponse.json({
        message: "logged in suceess",
        success: true
       })

       reponse.cookies.set(
        "token",token,{httpOnly:true}
    )

    return reponse



    } catch (error:any) {
         return NextResponse.json(
        {error: error.message},
        {status: 500}
    )
    }
}