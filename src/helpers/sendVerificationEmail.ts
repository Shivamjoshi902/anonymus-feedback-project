import { apiResponse } from './apiResponse';
import { Resend } from 'resend';
import VerificationEmail from '../../Email/emailVerification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    userName : string,
    email : string,
    otp : string
) : Promise<apiResponse>{
    console.log('HERE :', userName);
    console.log('HERE :',otp);
    try {
        const {data, error} = await resend.emails.send({
            from: 'sj8393006090@gmail.com',
            to: [email],
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({userName, otp}),
        });
        if(error){
            console.log(error)
            return { success: false, message: 'Failed to send verification email.' };
        }
        return { success: true, message: 'verification email send successfully.' };
    } catch (error) {
        console.log('error while sending verification email');
        return { success: false, message: 'Failed to send verification email.' };
    }
}