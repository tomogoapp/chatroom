
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateChatRoomDto {

    @IsString()
    chatroomName: string

    @IsString()
    @IsOptional()
    imagePortrait?:string

    @IsUUID()
    @IsString()
    createdBy:string

}
