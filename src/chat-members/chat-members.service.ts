import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateChatMemberDto } from './dto/create-chat-member.dto'
import { UpdateChatMemberDto } from './dto/update-chat-member.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ChatMember } from './entities/chat-member.entity'
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity'

@Injectable()
export class ChatMembersService {

  constructor(

    @InjectRepository(ChatMember)
    private readonly chatRoomMemberRepository: Repository<ChatMember>,

    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>
  ){}

 /**
  * This TypeScript function subscribes a user to a chat room, checking if the user is already a member
  * and updating their membership status if necessary.
  * @param {CreateChatMemberDto} createChatMemberDto - The `createChatMemberDto` parameter seems to be
  * an object containing information related to creating a chat member. It likely includes the `roomId`
  * property, which is used to identify the chat room to which the member will be added.
  * @param user - The `user` parameter in the `subscribe` function represents the user who is trying to
  * join a chat room. The function checks if the user is already a member of the chat room based on the
  * `roomId` and `userId` provided in the `createChatMemberDto`. If the user is
  * @returns The `subscribe` function returns either an existing `ChatRoomMember` entity if the user is
  * already a member of the chat room and their membership is reactivated, or a newly created
  * `ChatRoomMember` entity if the user is not already a member of the chat room.
  */
  async subscribe(createChatMemberDto: CreateChatMemberDto,user) {

    const { roomId } = createChatMemberDto
    const {id: userId } = user

    const room = await this.chatRoomRepository.findOne({ where: { id: roomId } })
    if (!room) throw new NotFoundException('Room not found')
  
    const alreadyMember = await this.chatRoomMemberRepository
      .createQueryBuilder('room')
      .where('room.roomId = :roomId AND room.memberId = :userId',{roomId,userId})
      .getOne()

    if(alreadyMember && !alreadyMember.isDeleted){
      throw new BadRequestException(`User is a member already! ${alreadyMember.isDeleted}`)
    }else if(alreadyMember && alreadyMember.isDeleted){

      let ChatRoomMember: ChatMember
  
      ChatRoomMember = await this.chatRoomMemberRepository.findOneBy({roomId:roomId , memberId: userId})
      ChatRoomMember.isDeleted = false
  
      this.chatRoomMemberRepository.save(ChatRoomMember)

      return ChatRoomMember

    }
    const membership = this.chatRoomMemberRepository.create({
      roomId: room.id,
      memberId: user.id,
      joinedAt: new Date()
    })
    await this.chatRoomMemberRepository.save(membership)
    return membership

  }

/**
 * This TypeScript function unsubscribes a user from a chat room by updating the ChatRoomMember entity.
 * @param {UpdateChatMemberDto} updateChatMemberDto - The `updateChatMemberDto` parameter seems to be
 * an object containing information related to updating a chat member. It likely includes the `roomId`
 * property, which is used to identify the chat room, among other possible properties.
 * @param user - The `user` parameter seems to represent a user object, possibly containing information
 * about the user who is being unsubscribed from a chat room. It appears to have an `id` property that
 * is being extracted as `userId` in the function.
 */
  async unsubscribe(updateChatMemberDto: UpdateChatMemberDto,user){    

    let ChatRoomMember: ChatMember
    const { roomId } = updateChatMemberDto
    const {id : userId } = user

    ChatRoomMember = await this.chatRoomMemberRepository.findOneBy({roomId:roomId , memberId: userId})
    ChatRoomMember.isDeleted = true

    this.chatRoomMemberRepository.save(ChatRoomMember)
    
  }

  private async validateData(roomId, user) {

    const room = await this.chatRoomRepository.findOne({ where: { id: roomId } })
    if (!room) throw new NotFoundException('Room not found')
  
    const alreadyMember = await this.chatRoomMemberRepository
      .createQueryBuilder('room')
      .where('room.roomId = :roomId AND room.memberId = :userId',{roomId,user})
      .getOne()

    if(alreadyMember) throw new BadRequestException('User has been removed')
   

  }

}
