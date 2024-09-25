import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/dbConnection/dbConnect";
import userModel from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest , NextResponse} from "next/server";

export async function POST(req : NextRequest){
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user : User = session?.user

    if(!session || !user){
        return NextResponse.json(
            {
                success : false,
                message : 'not authenticated',
                status : 500
            }
        )
    }

    const {acceptMessageStatus} = await req.json()
    
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            {isAcceptingMessage : acceptMessageStatus},
            { new : true}
        )

        if(!updatedUser){
            return NextResponse.json(
                {
                    success : false,
                    message : 'user not found',
                    status : 500
                }
            )
        }

        return NextResponse.json(
            {
                success : true,
                message : 'user accepting message status updated successfully',
                status : 200
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success : false,
                message : 'error while updating accepting message status',
                status : 500
            }
        )
    }
}


export async function GET(req:NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user : User = session?.user

    if(!session || !user){
        return NextResponse.json(
            {
                success : false,
                message : 'not authenticated',
                status : 500
            }
        )
    }

    try {
        const foundUser = await userModel.findById(user._id)

        if(!foundUser){
            return NextResponse.json(
                {
                    success : false,
                    message : 'user not found',
                    status : 500
                }
            )
        }

        return NextResponse.json(
            {
                success : true,
                isAcceptingMessage : foundUser.isAcceptingMessage,
                status : 200
            }
        )

    } catch (error) {
        return NextResponse.json(
            {
                success : false,
                message : 'error while getting user info',
                status : 500
            }
        )
    }
}
