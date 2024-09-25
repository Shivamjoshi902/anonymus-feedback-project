import dbConnect from "@/dbConnection/dbConnect";
import { getServerSession, User } from "next-auth";
import { NextRequest,NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import userModel from "@/models/user.model";


export async function DELETE(req : NextRequest,
    {params} : {params : {messageid : string}}
) {
    try {
        dbConnect()
        const messageId = params.messageid;
        const session = await getServerSession(authOptions)
        const _user: User = session?.user
        if(!session || !_user){
            return NextResponse.json(
                {
                    success : false,
                    message : 'not authenticated',
                    status : 500
                }
            )
        }
    
        const updatedUser = await userModel.updateOne(
            { _id : _user._id},
            { $pull : {messages : { _id : messageId}}}
        )
    
        if(updatedUser.upsertedCount === 0){
            return NextResponse.json(
                {
                    success : false,
                    message : 'message not found',
                    status : 500
                }
            )
        }
    
        return NextResponse.json(
            {
                success : true,
                message : 'message deleted successfully',
                status : 200
            }
        )    
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success : false,
                message : 'something went wrong while deleting message',
                status : 500,
                error : error
            }
        )   
    }
}