import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/dbConnection/dbConnect";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";


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
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            authorization: {
                params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                }
            }
        })
    ],
    callbacks : {
        async signIn({ user, account, profile }) {
            await dbConnect();

            if (account?.provider === "google") {
            // Look for existing user by email
            const existingUser = await userModel.findOne({ email: user.email });

            if (existingUser) {
                // Merge Google login with existing user
                user._id = existingUser._id?.toString();
                user.userName = existingUser.userName || user.userName;
                user.isVerified = existingUser.isVerified ?? false;
                user.isAcceptingMessage = existingUser.isAcceptingMessage ?? true;
            } else {
                // Create new user if none exists

                let baseUsername = profile?.name || user.email?.split("@")[0];
                baseUsername = `${baseUsername}_${nanoid(5)}`;
                
                const newUser = await userModel.create({
                    email: user.email,
                    userName: baseUsername,
                    isVerified: true,               // mark as verified
                    isAcceptingMessage: true,
                    messages: [],
                    password: Math.random().toString(36).slice(-10), // random dummy password
                    verifyToken: "google-oauth",
                    verifyTokenExpiry: new Date(),
                });

                user._id = newUser._id?.toString();
                user.userName = newUser.userName;
                user.isVerified = newUser.isVerified;
                user.isAcceptingMessage = newUser.isAcceptingMessage;
            }
            }

            return true;
        },


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
