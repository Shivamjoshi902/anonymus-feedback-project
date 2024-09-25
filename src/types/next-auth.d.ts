import "next-auth";

declare module "next-auth"{
    interface User{
        _id? : string;
        isAcceptingMessage? : Boolean;
        isVerified? : Boolean;
        userName? : string;
    }
    interface Session{
        user: {
            _id? : string;
            isAcceptingMessage? : Boolean;
            isVerified? : Boolean;
            userName? : string;
        } & DefaultSession['user'];
    }
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        userName?: string;
    }
}