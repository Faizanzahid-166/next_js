import {resend} from '@/lib/resend'
import VerificationEmail from '../../email/VerificationEmail'
import {ApiResponse} from '@/types/ApiResponse'

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mystry message | verification code',
        react: VerificationEmail({username, otp: verifyCode}),
        });

        return {
            success:true,
            message: 'Successfully send verification email'
        }
        
    } catch (emaiError) {

        console.error('Error sending verification email', emaiError)
        return {
            success:false,
            message: 'failed to send verification email'
        }
    }
}