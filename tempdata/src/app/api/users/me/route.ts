import { connect } from "@/dbConfig/DbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/Helper/getDataFromToken";
import User from "@/Models/userModels";
connect()

export async function POST(request:NextRequest){
    const userId = await getDataFromToken(request)
    const user = await User.findOne({_id:userId}).select(
        "-password"
    )
    return NextResponse.json({
        message : "User found",
        data : user
    })


}
