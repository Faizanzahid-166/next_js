import {Message} from '@/model/User'

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMsg?: boolean;
    messages?: Array<Message>
}