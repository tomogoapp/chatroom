import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMember } from "src/chat-members/entities/chat-member.entity";
import { Repository } from "typeorm";

@Injectable()
export class CheckAuthProvider {
    constructor (
        @InjectRepository(ChatMember)
        private readonly chatMemberRepository: Repository<ChatMember> 
    ){

    }

/**
 * The function `handleCheckAuth` checks if a user is a member of a specific chat room and returns a
 * boolean value.
 * @param {string} user - The `user` parameter represents the user ID or username of the user whose
 * authentication is being checked in the chat room.
 * @param {string} room - The `room` parameter refers to the identifier of the chat room for which you
 * want to check the authentication status.
 * @returns A Promise that resolves to a Boolean value indicating whether the user is authorized in the
 * specified chat room.
 */
    async handleCheckAuth(user:string,room:string): Promise<Boolean>{

        const checkauth = await this.chatMemberRepository.createQueryBuilder('chatroom')
        .where('chatroom.roomId = :room AND chatroom.memberId = :user',{room,user})
        .getCount()
        return new Boolean(checkauth)
    
    } //🟩

}