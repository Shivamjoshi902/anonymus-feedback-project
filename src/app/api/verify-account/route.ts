import userModel from '@/models/user.model'
import dbConnect from '@/dbConnection/dbConnect'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req : Request) {
    await dbConnect()
    try {
        const {userName, code} = await req.json();
        const user = await userModel.findOne({userName : userName})
        if(!user){
            return NextResponse.json(
                {
                    success : false,
                    message : 'user not found by userName during account verification'
                },
                {
                    status : 500
                }
            )
        }

        const isCodeCorrect = user.verifyToken === code
        const isCodeNotExpired = new Date(user.verifyTokenExpiry) > new Date()

        if(isCodeCorrect && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return NextResponse.json(
                {
                    success : true,
                    message : 'user verified successfully'
                },
                {
                    status : 200
                }
            )
        }
        else if (!isCodeCorrect) {
            return NextResponse.json(
                {
                    success : false,
                    message : 'verification code is incorrect'
                },
                {
                    status : 500
                }
            )
        }
        else {
            return NextResponse.json(
                {
                    success : false,
                    message : 'verification code has expired. please signup again.'
                },
                {
                    status : 500
                }
            )
        }

    } catch (error) {
        console.error('error while verifying user : ', error)
        return NextResponse.json(
            {
                success : false,
                message : 'error while verifying user'
            },
            {
                status : 500
            }
        )
    }
}