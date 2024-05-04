import { PartialType } from '@nestjs/swagger';
import { CreateChatRoomDto } from './create-chat-room.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {

    @IsBoolean()
    @IsOptional()
    isActive?: boolean
    
    @IsBoolean()
    @IsOptional()
    isDeleted?: boolean
}
