import { resend } from "@/lib/resend";
import VerificationEmail  from "../../emails/verificationMain";

import { Apiresponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
    ): Promise<Apiresponse> {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verify your email address',
        react: VerificationEmail({
           username,otp:  verifycode 
        }),
      });
        return {
            success: true,
            message: "Email sent successfully",
        };
    } catch (emailError) {
        console.error('Error sending email', emailError);
        return {
        success: false,
        message: "An error occured while sending the email",
        };
    }
    }


