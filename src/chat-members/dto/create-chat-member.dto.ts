import { IsDateString, IsString, IsUUID } from "class-validator"

export class CreateChatMemberDto {
    
    @IsUUID()
    @IsString()
    roomId:string

}
