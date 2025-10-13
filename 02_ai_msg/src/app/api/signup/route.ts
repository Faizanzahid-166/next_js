import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'

import {sendVerificationEmail} from '@/heplers/sendVerificationEmail'
import { success } from 'zod';

export async function POST(request: Request) {
    try {

       const {username, email, password} = await request.json()

       const existingUserVerify =  await UserModel.findOne({
        username,
        isVerified:true
       })

       if (existingUserVerify) {
        return Response.json(
            {
                success: false,
                message: 'already username taken'
            },
            {
                status: 400,
            }
        )
       }

       await UserModel.

    } catch (error) {

        console.error('error registering user', error);
        return Response.json(
            {
                success: false,
                message: 'error user register'
            },
            {
                status: 500,
            }
        )
        
    }
}