import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { request } from "http";
import mongoose from "mongoose";

export async function GET(request:Request) {
     await dbConnect()

    const sesstion = await getServerSession(authOptions)
    const user: User = sesstion?.user as User

    if (!sesstion || !sesstion.user) {
        return Response.json(
            {
                success: false,
                message: "not authenticated"
            },
            {
                status: 401
            }
        )
    }

    // mongoose aggrigation pipe line
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort:{'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if (!user || user.length === 0) {
             return Response.json(
            {
                success: false,
                message: "User not authenticated i pipeline"
            },
            {
                status: 401
            }
        )
    
        }

         return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
         return Response.json(
            {
                success: false,
                message: "User not authenticated in pipeline"
            },
            {
                status: 500
            }
        )
    }
}