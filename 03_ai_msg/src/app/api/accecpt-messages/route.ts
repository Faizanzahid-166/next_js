import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function POST(request:Request) {
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

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessages},
            {new:  true}
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept message"
            },
            {
                status:401
            })
        }

          return Response.json({
                success: true,
                message: "successfully to update user status to accept message",
                updatedUser
            },
            {
                status:200
            })
    } catch (error) {

        console.log("failed to update user status to accept message error!, error!")
        return Response.json({
                success: false,
                message: "failed to update user status to accept message"
            },
            {
                status:401
            })
    }
}

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

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
              return Response.json(
                {
                    success: false,
                    message: "User not found authenticated"
                },
                {
                    status: 404
                }
            )
        }
    
          return Response.json(
                {
                    success: true,
                    isAcceptingMessage: foundUser.isAcceptingMessage
                },
                {
                    status: 200
                }
            )
    } catch (error) {
         console.log("failed to update user status to accept message error!, error!")
        return Response.json({
                success: false,
                message: "failed ERROR get to update user status to accept message"
            },
            {
                status:401
            })
    }
}