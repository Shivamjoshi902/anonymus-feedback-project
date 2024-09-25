import dbConnect from "@/dbConnection/dbConnect";
import userModel from "@/models/user.model";
import { Message } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    await dbConnect()
    const {userName, content} = await req.json();

    try {
        const user = await userModel.findOne({userName})
        if(!user){
            return NextResponse.json(
                {
                    success : false,
                    message : 'user not found',
                    status : 500
                }
            )
        }
        if(!user?.isAcceptingMessage){
            return NextResponse.json(
                {
                    success : false,
                    message : 'user is not accepting any messages currently',
                    status : 500
                }
            )
        }

        const newMessage = {
            content ,
            createdAt : new Date
        }

        user?.messages.push(newMessage as Message)
        await user?.save();

        return NextResponse.json(
            {
                success : true,
                message : 'message sent successfully',
                status : 200
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success : false,
                message : 'error while sending message',
                status : 500
            }
        )
    }
}
