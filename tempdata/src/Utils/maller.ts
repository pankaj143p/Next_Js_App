import User from '@/Models/userModels';
import nodemailer from 'nodemailer'
import bycryptjs from 'bcryptjs'
export const sentEmail = async ({ email, emailType, userId }: { email: string, emailType: string, userId: any }) => {
  try {
    const hashedToken = await bycryptjs.hash(userId.toString(), 10);

    if (emailType == "VERIFY") {
      await User.findByIdAndUpdate(userId,
        {
          $set:
          {
          verifyToken: hashedToken
          , verifyTokenExpiry: (Date.now()
            + 3600000)
        }
        });
    }

    else if (emailType == "RESET") {
      await User.findByIdAndUpdate(userId,
        {
          forgetPasswordToken: hashedToken
          , forgetPasswordTokenExpiry: Date.now()
            + 3600000
        })
    }


    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "1e273ae08236bf", // 🧐🧐
        pass: "124151df7c294" // 😒🧐
      }
    });

    const mailOptions = {
      from: 'pankaj.coder@gamil.com', // sender address
      to: email, // list of receivers
      subject: emailType == 'VERIFY' ? "verify your email" : "Reset you password", // Subject line
      html: `<p>Click <a href="${process.env.DOMAIN}/
      verifyemail?token=${hashedToken}
      ">here</a>to ${email==="VERIFY" ? 
      "verify your email" : "reset your password"}
      or copy paste below link on your browser 
      <br>${process.env.DOMAIN}
      <p>`,

    }
    const mailResponse = await transport.sendMail(mailOptions)
    return mailOptions
  } catch (error: any) {
    throw new Error(error.message)
  }
}