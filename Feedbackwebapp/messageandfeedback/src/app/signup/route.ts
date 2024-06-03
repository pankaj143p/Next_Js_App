import dbConnect from "@/lib/dbConnects";
import UserModel from "@/Models/userModel"
import bcrypt from 'bcrypt'
import { sendVerificationEmail } from "@/Helpers/sendVerificationsEmail";

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
        const verifycode = Math.floor(100000 + Math.random() * 900000).toString()
        
        if(existingUserVerifiedByEmail){
            true 
            
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
            await sendVerificationEmail(email,username,verifycode)
            
        }

    } catch (error){
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