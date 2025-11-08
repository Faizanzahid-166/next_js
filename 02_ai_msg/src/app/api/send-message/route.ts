import UserModel from "@/model/User";
import {Message} from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async  function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

   try {
     const user = await UserModel.findOne({username})
     if (!user){
          return Response.json(
             {
                 success: false,
                 message: "User not found in pipeline"
             },
             {
                 status: 404
             }
         )
     }

     //is user accepting messsages

     if(!user.isAcceptingMessage){
         return Response.json(
             {
                 success: false,
                 message: "User not accepting the in messages"
             },
             {
                 status: 403
             }
         )
     }

     const newMessage = {content, createdAt: new Date()}
     user.message.push(newMessage as Message)
     await user.save()

      return Response.json(
             {
                 success: true,
                 message: "message send successfully"
             },
             {
                 status: 200
             }
         )
   } catch (error) {
    console.log('error messages',error);
    
      return Response.json(
             {
                 success: false,
                 message: "Internal messages  error"
             },
             {
                 status: 500
             }
         )
   }
}