import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userValidation } from "@/schemas/signupSchema";
import { z} from "zod";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if (!user) {
             return Response.json(
        {
            success:false,
            message: 'User not found'
        },
        {status:500}
     )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

              return Response.json(
        {
            success:true,
            message: 'Account verify success'
        },
        {status:200}
         )
        } else if (!isCodeNotExpired){
              return Response.json(
        {
            success:false,
            message: 'Account verify code has been expired try a new code'
        },
        {status:400}
         )
        }else{
              return Response.json(
        {
            success:false,
            message: 'Incorrect Verificatin code'
        },
        {status:400}
         )
        }

    } catch (error) {
         console.error('error verifying username ',error);
     return Response.json(
        {
            success:false,
            message: 'error checking username'
        },
        {status:500}
     )
    }
}