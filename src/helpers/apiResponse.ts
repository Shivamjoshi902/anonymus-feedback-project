import { Message } from "@/models/user.model";

export interface apiResponse{
    success : boolean,
    message : string,
    isAccetingMessage? : boolean,
    messages? : Array<Message>
}