import { connect } from "@/dbConfig/DbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from '@/Models/userModels'
import bcryptjs from 'bcryptjs'
import { sentEmail } from "@/Utils/maller";
import jwt from 'jsonwebtoken'; // Add this line

connect()
export async function POST(request:NextRequest){
    // for login 
    try {
        const reqBody = await request.json()
        const {email,password} = reqBody
        console.log(reqBody)
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: 'user does not exists'},{status: 400})
        }
        console.log("User exists");
        const validPassword = await bcryptjs.compare(password,user.password)
        if(!validPassword){
            return NextResponse.json({error: 'Invalid password'},{status: 400})
        }

        // console.log("Password is valid");
        const tokenData = {
            _id: user._id,
            email: user.email,
            username: user.username
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn : '1d'})
        console.log(token);
        const response = NextResponse.json({message: 'Login successfull',
            success: true,
        })

        response.cookies.set("token",token,{
            httpOnly: true,
        })
    } catch (error : any) {
        return NextResponse.json({error:error.message},
            {status : 500})
    }
}
