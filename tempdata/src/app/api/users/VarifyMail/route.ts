import { connect } from "@/dbConfig/DbConfig";
import { NextRequest, NextResponse } from "next/server";
import  User from '@/Models/userModels'
import bcryptjs from 'bcryptjs'
import { sentEmail } from "@/Utils/maller";

connect()
export async function POST(request:NextRequest){
    try {
     const reqBody = await request.json()
        const {token} = reqBody
        console.log(token)
        
        const user = await User.findOne({verifyToken: token,
        verifyTokenExpiry: {$gt: Date.now()}})
        if(!user){
            return NextResponse.json({error: 'Invalid or expired token'},{status: 400})
        }
        console.log(user)
        user.isVerified = true,
        user.verifyToken = undefined,
        user.verifyTokenExpiry = undefined
        await user.save()
        return NextResponse.json({message: 'Email verified successfully'
            ,success: true
        },{status: 200})
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({error:error.message},{status:500})
        }


    }
