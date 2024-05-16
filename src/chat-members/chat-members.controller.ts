import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ChatMembersService } from './chat-members.service'
import { CreateChatMemberDto } from './dto/create-chat-member.dto'
import { UpdateChatMemberDto } from './dto/update-chat-member.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity'
import { Repository } from 'typeorm'
import { Auth, GetUser } from 'src/auth/decorators'
import { User } from 'src/auth/entities/user.entity'

@Controller('chat-members')
export class ChatMembersController {
  constructor(
    
    private readonly chatMembersService: ChatMembersService,
    
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,

  ) {}

  @Post('/subscribe')
  @Auth()
  async subscribeToRoom(
    @Body()
    createChatMemberDto: CreateChatMemberDto,
    @GetUser() user: User,
  ) {

    //get roomId, either creating a chatroom or suscribing to a chatroom
    // let getRoomId: ChatRoom
    // 
    // getRoomId = await this.chatRoomRepository.preload({
    //   id: roomId,
    // })

    // console.log('getRoomId =>',getRoomId)

    // createChatMemberDto.roomId = getRoomId.id
    // createChatMemberDto.joinedAt = date.toLocaleString()

    // 
    return this.chatMembersService.subscribe(createChatMemberDto,user)

  }

  @Patch('/unsubscribe')
  @Auth()
  async unsubscribeToRoom(
    @Body()
    updateChatMemberDto: UpdateChatMemberDto,
    @GetUser() user: User,
  ){
    return this.chatMembersService.unsubscribe(updateChatMemberDto,user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //return this.chatMembersService.unsubscribe();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatMemberDto: UpdateChatMemberDto) {
    //return this.chatMembersService.unsubscribe();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //return this.chatMembersService.unsubscribe();
  }
}
