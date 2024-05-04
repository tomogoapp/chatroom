import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ErrorRequestProvider } from 'src/providers/error-request.provider';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ChatRoomService {

  constructor(

    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly errorRequestProvider: ErrorRequestProvider,

  ){}

  async create(createChatRoomDto: CreateChatRoomDto,user) {

    try{

      const { createdBy, ...chatRoom } = createChatRoomDto

      const chatroom = this.chatRoomRepository.create({
        ...chatRoom,
        createdBy:user.id
      })

      await this.chatRoomRepository.save(chatroom)

      return chatroom

    }catch(error){
      this.errorRequestProvider.handleDBException(error)
    }
   
  }

  async findAll(paginationDto: PaginationDTO) {
    
    const { limit = 2, offset = 0 } = paginationDto

    const chatrooms = await this.chatRoomRepository.find(
      {
        skip: offset,
        take: limit
      }
    )

    return chatrooms

  }

  async findOne(term: string) {
    let chatroom: ChatRoom

    const searchCondition = isUUID(term) ? { id:term } : { slug: term }
    chatroom = await this.chatRoomRepository.findOneBy(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    return chatroom;
  }

  update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
    return `This action updates a #${id} chatRoom`;
  }

  async disable(term: string){
    let chatroom: ChatRoom
    const searchCondition = isUUID(term) ? { id:term } : { slug: term }

    chatroom = await this.chatRoomRepository.findOneBy(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    chatroom.isActive = false

    this.chatRoomRepository.save(chatroom)

    return `Esta sala de chat ya no esta disponible`
  }

  async delete( term: string ){
    let chatroom: ChatRoom
    const searchCondition = isUUID(term) ? { id:term } : { slug: term }

    chatroom = await this.chatRoomRepository.findOneBy(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    chatroom.isDeleted = true

    this.chatRoomRepository.save(chatroom)

    return `Esta sala de chat ha sido borrada`
  }

  async remove(term: string) {
    let chatroom: ChatRoom
    const searchCondition = isUUID(term) ? { id:term } : { slug: term }
    chatroom = await this.chatRoomRepository.findOne({where:searchCondition})

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    await this.chatRoomRepository.remove(chatroom)

    return `Esta sala de chat ha sido removida del servidor`

  }
}
