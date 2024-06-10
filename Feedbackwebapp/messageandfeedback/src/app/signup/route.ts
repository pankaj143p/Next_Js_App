import dbConnect from "@/lib/dbConnects";
import UserModel from "@/Models/userModel"
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "@/Helpers/sendVerificationsEmail";
import { log } from "console";

export async function POST(request : Request){
    await dbConnect();
    try {
       const {username,email,password} = await request.json()
       console.log(username,email,password);
       
       const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified : true,
       })
      
         if(existingUserVerifiedByUsername){
          return Response.json(
                {
                 success: false,
                 message: "Username already exists",
                },
                {
                 status: 400,
                }
                ) 
                }
       
        
        // by email
        const existingUserVerifiedByEmail = await UserModel.findOne({
            email
        })
        // random otp generate 
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString()
        
        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists with user",
                    },
                    {
                        status: 400,
                    }
                )
            }else{
               const hashPassword = await bcrypt.hash(password,10)
               existingUserVerifiedByEmail.password = hashPassword;
               existingUserVerifiedByEmail.verifyCode = verifycode;
               existingUserVerifiedByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
               await existingUserVerifiedByEmail.save() 
            }

            
        }else{
            const hashPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password : hashPassword,
                verifyCode : verifycode,
                verifyCodeExpiry : expiryDate,
                createdAt : Date,
                isAcceptedMessage : true,
                isVerified : false,
                messages:  [],
            })
            await newUser.save()
            
        }
        // send verification code 
      const emailResponse =   await sendVerificationEmail(email,username,verifycode)
      
        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                {
                    status: 500,
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "User created successfully , please verify your email",
            },
            {
                status: 201,
            })
        }     
        

    catch (error){
        console.error('Error Registering User',error)
        return Response.json(
          {
                success: false,
                message: "An error occured while creating the user",
            },
            {
                status: 500,
            }
        )         
    }
}