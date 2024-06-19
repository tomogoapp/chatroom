import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommonService {
    constructor (
        @InjectRepository(ChatMember)
        private readonly chatMemberRepository: Repository<ChatMember> 
    ){

    }
    async handleCheckAuth(user:string,room:string): Promise<Boolean>{

        const checkauth = await this.chatMemberRepository.createQueryBuilder('chatroom')
        .where('chatroom.roomId = :room AND chatroom.memberId = :user',{room,user})
        .getCount()

        return new Boolean(checkauth)
    
    } //🟩

}