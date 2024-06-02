import { Message } from '@/Models/userModel';

export interface Apiresponse{
    success: boolean;
    message: string;
    isAcceptingMessage? : boolean;
    messages?: Array<Message>; 

}