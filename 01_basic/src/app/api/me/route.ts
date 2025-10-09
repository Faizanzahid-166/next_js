import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/user.model'
import { NextResponse, NextRequest } from 'next/server'
import { getdatafromtoken } from '@/helpers/getdatafromtoken'

connect()

export async function POST(request:NextRequest) {
    //extract data from token
    const userId = await getdatafromtoken(request)
    const user = await User.findOne({_id:userId}).select("-password")

    //check if there is no user
    return NextResponse.json({
        message:"User found",
        data: user
    })
}
