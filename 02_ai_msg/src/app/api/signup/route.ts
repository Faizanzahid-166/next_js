import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'

import {sendVerificationEmail} from '@/heplers/sendVerificationEmail'
import { success } from 'zod';

export async function POST(request: Request) {
    try {
           await dbConnect();
       const {username, email, password} = await request.json()
       
       //check by username
       const existingUserVerifyByusername =  await UserModel.findOne({
        username,
        isVerified:true
       })

       if (existingUserVerifyByusername) {
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

       // check new user by email
       const existingUserByEmail =  await UserModel.findOne({email})

       // verifyCode OPT
       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

       if (existingUserByEmail) {
        // another if state
        if (existingUserByEmail.isVerified) {
            return Response.json({
                success: false,
                message: 'User already exits'
            },{
                status:400
            })
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
        }
       }else {

        const hashedPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isAcceptingMessage: true,
            isVerified: false,
            message: []
        })

        await newUser.save()

        }

        // send verification Email
        const emailResponse = await sendVerificationEmail(
            email,username,verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success:false,
                message:emailResponse.message
            },{
                status:500
            })
        }

        return Response.json({
                success:true,
                message: 'User reistered successfully. verify code'
            },{
                status:201
            })

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