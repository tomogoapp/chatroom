import { IsEmail, IsString } from "class-validator";

export class CreateChatRoomDto {

    @IsString()
    @IsEmail()
    chatroom_name: string

    @IsString()
    image_portrait:string

}
