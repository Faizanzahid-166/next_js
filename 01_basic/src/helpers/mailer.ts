import User from '@/models/user.model';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail = async({email, emailType, userId}:any) => {
    try {

      const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        //log
        console.table([email, typeof emailType, userId])
        if(emailType == "VERIFY"){
            await User.findByIdAndUpdate(
            userId,{
           $set: {
              verifyToken: hashedToken,
              verifyTokenExpiry: new Date(Date.now() + 3600000)
            }
          }
          )
      }else if (emailType == "RESET"){
        await User.findByIdAndUpdate(
            userId,{
            $set:{
              forgotPaswordToken: hashedToken,
              forgotPaswordTokenExpiry: new Date(Date.now() + 3600000)
            }
          }
          )
      }


        // Create a test account or replace with real credentials.
// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9ba3d45fcd2657",
    pass: "1215037e18508f"
  }
});

const mailOptions = {
    from: 'faizanzahid@gmailcom',
    to: email,
    subject: emailType === 'VERIFY' ? "VERIFY your email" : "Reset your password",
    html: `<p> Click
               <a href="${process.env.DOMAIN}/pages/verifyemail?token=${hashedToken}">here</a>
               to ${emailType === 'VERIFY' ? "VERIFY your email" : "Reset your password"}
               or copy and paste the link below in your browser.
               <br/>
               ${process.env.DOMAIN}/pages/verifyemail?token=${hashedToken}
           </p>`, // HTML body
}

  const info = await transport.sendMail(mailOptions)
  return info

    } catch (error:any) {
        throw new Error(error.message)
    }
}