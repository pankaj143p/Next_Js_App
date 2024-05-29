import { connect } from "@/dbConfig/DbConfig";
import { NextRequest, NextResponse } from "next/server";
import  User from '@/Models/userModels'
import bcryptjs from 'bcryptjs'
import { sentEmail } from "@/Utils/maller";

connect()
export async function GET(request:NextRequest){
  try {
     const respose = NextResponse.json({
        message : "logout Successfully",
        success : true
    })
    respose.cookies.set("cookeis","",{
        httpOnly : true,
        expires : new Date(0)
    })
    return respose;
                     
  } catch (error : any) {
       return NextResponse.json({error : error.message},{status : 500})

  }   
}
