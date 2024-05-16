import { PartialType } from '@nestjs/swagger';
import { CreateChatMemberDto } from './create-chat-member.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateChatMemberDto extends PartialType(CreateChatMemberDto) {

    @IsUUID()
    @IsString()
    @IsOptional()
    idDeleted?:string

}
