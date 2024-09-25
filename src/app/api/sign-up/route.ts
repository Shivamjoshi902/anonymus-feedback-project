import dbConnect from "@/dbConnection/dbConnect";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/models/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req : NextRequest){
    await dbConnect();
    try {
        const {userName, email, password} = await req.json()

        const existingUserByUserName = await userModel.findOne({
            userName,
            isVerified : true
        })
        if(existingUserByUserName){
            return NextResponse.json(
                {
                    success : false,
                    message : "user already exist by this userName",
                    status : 500
                }
            )
        }

        const existingUserByEmail = await userModel.findOne({email})
        const token = Math.floor(100000 + (Math.random() * 900000 )).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json(
                    {
                        success : false,
                        message : "user already exist by this email",
                        status : 500
                    }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyToken = token
                existingUserByEmail.verifyTokenExpiry = new Date(Date.now() + 36000000)
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new userModel({
                userName,
                email,
                password : hashedPassword,
                verifyToken : token,
                verifyTokenExpiry : new Date(Date.now() + 36000000),
                isAcceptingMessage : true,
                isVerified : false,
                messages : []
            })
            await newUser.save()    
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(userName, email, token.toString());
        if(!emailResponse.success){
            return NextResponse.json(
                {
                    success : false,
                    message : emailResponse.message,
                    status : 500
                }
            )
        }
        else{
            return NextResponse.json(
                {
                    success : true,
                    message : "sign up successfull. please verify your email",
                    status : 200
                }
            )
        }
        
    } catch (error) {
        console.log("error while signing up");
        return NextResponse.json(
            {
                success : false,
                message : "error while signing up",
                status : 500
            }
        )
    }
}