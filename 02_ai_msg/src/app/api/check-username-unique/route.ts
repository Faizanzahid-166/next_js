import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userValidation } from "@/schemas/signupSchema";
import { z} from "zod";

const UsernameQuerySchema = z.object({
    username: userValidation
})

export async function GET(request: Request) {
    // if (request.method !== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: 'Method not allowed'
    //     },{ status: 405})
    // }
    
    await dbConnect()

    
    try {
        const {searchParams } =  new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validation with zod

        const result = UsernameQuerySchema.safeParse(queryParam)

        console.log(result);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Invalid query parameters'
            },{
                status:400
            })
        }
        
        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            },{status: 400})
        }

        return Response.json({
            success: true,
            message: 'Username is already taken'
        },{status:400})

    } catch (error) {
     console.error('error checking username ',error);
     return Response.json(
        {
            success:false,
            message: 'error checking username'
        },
        {status:500}
     )
    }
}

