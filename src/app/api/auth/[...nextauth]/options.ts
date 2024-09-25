import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/dbConnection/dbConnect";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs"

export const authOptions : NextAuthOptions = {
    providers : [

        CredentialsProvider({
            id: 'credentials',
            name: "Credentials",
            credentials: {
              email: { label: "email", type: "text" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials : any) : Promise<any> {
                await dbConnect()
                try {
                    const user = await userModel.findOne({
                        $or : [
                            {email : credentials.identifier},
                            {userName : credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email');
                    }
                    if(!user.isVerified){
                        throw new Error('please verify your email before login');
                    }
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if(!isPasswordCorrect){
                        throw new Error('wrong password');
                    }
                    return user;

                } catch (error : any) {
                    console.log("error while signin");
                    throw new Error(error);
                }
            }
          })
    
    ],
    callbacks : {
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.userName = user.userName;
                token.isVerified = user.isVerified;
            }
            return token
        },

        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.isVerified = token.isVerified;
                session.user.userName = token.userName;
            }
            return session
        }
    },
    pages :{
        signIn : "/sign-in"
    },
    session : {
        strategy : 'jwt'
    },
    secret : process.env.NEXT_AUTH_SECRET,
}
