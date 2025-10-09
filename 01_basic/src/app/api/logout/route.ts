import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/user.model'
import { NextResponse, NextRequest } from 'next/server'

connect()

export async function GET(request:NextRequest) {
    try {
        const reponse = NextResponse.json({
            message: "logout successfully",
            success: true
        })

          reponse.cookies.set(
        "token",
        "",
        {
            httpOnly:true,
            expires: new Date(0)
        }
    )

    return reponse


    } catch (error:any) {
          return NextResponse.json(
        {error: error.message},
        {status: 500}
    )
    }
}