import { IsBoolean, isDate, IsISO8601, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateChatMessageDto {

    @IsUUID()
    roomId: string

    // @IsUUID()
    // userId: string

    @IsString()
    messageText: string

    @IsString()
    @IsOptional()
    filePath?: string

    @IsString()
    @IsOptional()
    fileType?: string

}
