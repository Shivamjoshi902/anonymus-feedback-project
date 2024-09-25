import {z} from 'zod'
import userModel from '@/models/user.model'
import { userNameValidation } from '@/validationSchemas/signupValidation'
import dbConnect from '@/dbConnection/dbConnect'
import { NextRequest, NextResponse } from 'next/server'

const userNameValidationSchema = z.object({
    userName : userNameValidation
})

export async function GET(req : NextRequest) {
    await dbConnect()
    
    try {
        const {searchParams} = new URL (req.url)
        const queryParams = {
            userName : searchParams.get('username')
        }
        const result = userNameValidationSchema.safeParse(queryParams)

        if(!result.success){
            return NextResponse.json(
                {
                    success : false,
                    message : 'userName validation error'
                },
                {
                    status : 500
                }
            ) 
        }

        const {userName} = result.data
        console.log(result)
        const existingVerifiedUser = await userModel.findOne({userName, isVerified : true})

        if(existingVerifiedUser){
            return NextResponse.json(
                {
                    success : false,
                    message : 'userName already exists'
                },
                {
                    status : 200
                }
            ) 
        }

        return NextResponse.json(
            {
                success : true,
                message : 'Username is unique'
            },
            {
                status : 200
            }
        ) 
        
        
    } catch (error : any) {
        console.error('error while checking uniqueness of userName : ',error)
        return NextResponse.json(
            {
                success : false,
                message : 'error while checking uniqueness of userName'
            },
            {
                status : 500
            }
        )
    }
}