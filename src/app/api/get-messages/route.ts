import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/dbConnection/dbConnect";
import userModel from "@/models/user.model";
import { User } from "next-auth";
import { NextRequest , NextResponse} from "next/server";
import mongoose from "mongoose";

export async function GET(req : NextRequest){
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user : User = session?.user

    if(!session || !user){
        return NextResponse.json(
            {
                success : false,
                message : 'not authenticated',
                messages : [],
                status : 500
            }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    
    try {
        const updatedUser = await userModel.aggregate([
            { $match : {_id : userId } },
            {
                $unwind : '$messages'
            },
            {
                $sort : {'messages.createdAt' : -1}
            },
            {
                $group : {_id : '$_id', messages : {$push : '$messages'}}
            }
        ]).exec();

        if(!updatedUser || updatedUser.length === 0){
            return NextResponse.json(
                {
                    success : false,
                    messages : [],
                    message : 'error while getting messages from database',
                    status : 500
                }
            )
        }
        return NextResponse.json(
            {
                success : true,
                messages : updatedUser[0].messages,
                status : 200
            }
        )
        
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success : false,
                message : 'error while getting messages',
                messages : [],
                status : 500
            }
        )
    }
}