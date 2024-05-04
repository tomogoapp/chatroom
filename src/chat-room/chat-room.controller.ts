
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException
} from '@nestjs/common'
import { ChatRoomService } from './chat-room.service'
import { CreateChatRoomDto } from './dto/create-chat-room.dto'
import { UpdateChatRoomDto } from './dto/update-chat-room.dto'
import { Auth, GetUser } from 'src/auth/decorators'
import { validRoles } from 'src/auth/interface'
import { User } from 'src/auth/entities/user.entity'
import { FileInterceptor } from '@nestjs/platform-express'
import { FilesService } from 'src/files/files.service'
import { PaginationDTO } from 'src/common/dto/pagination.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ChatRoom } from './entities/chat-room.entity'
import { Repository } from 'typeorm'
import { isUUID } from 'class-validator'

@Controller('chat-room')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,

    private fileService: FilesService,

    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,

  ) { }

  @Post()
  @Auth(
    validRoles.admin,
    validRoles.superUser
  )
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    createChatRoomDto: CreateChatRoomDto,
    @GetUser() user: User
  ) {

    const uploadImage = await this.fileService.createFile(file)
    createChatRoomDto.imagePortrait = uploadImage === null ? null : uploadImage.Location

    console.log('file => ',file)
    console.log('createChatRoomDto.imagePortrait => ',createChatRoomDto.imagePortrait)

    return this.chatRoomService.create(createChatRoomDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDTO
  ) {
    return this.chatRoomService.findAll(paginationDto);
  }

  /* The `@Get(':term')` decorator in the `ChatRoomController` class is defining a GET endpoint for
  retrieving a specific chat room based on a term parameter in the URL. When a GET request is made to
  this endpoint with a term parameter in the URL, the `findOne` method is called. Inside the `findOne`
  method, the `term` parameter is used to identify the specific chat room that needs to be retrieved,
  and then the `chatRoomService.findOne(term)` method is called to fetch and return the details of
  that chat room asynchronously. */
  @Get(':term')
  async findOne(@Param('term') term: string) {
    return await this.chatRoomService.findOne(term);
  }

/* The `@Patch(':term')` decorator in the `ChatRoomController` class is defining a PATCH endpoint for
updating a chat room based on a specific term. Here's a breakdown of what each part of the code is
doing: */
  @Patch(':term')
  @Auth(
    validRoles.admin,
    validRoles.superUser
  )
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('term') term: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
    @GetUser() user: User
  ) {

    let chatroom: ChatRoom
    const searchCondition = isUUID(term) ? { id: term } : { slug: term }
    chatroom = await this.chatRoomRepository.preload(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    console.log('chatroom.imagePortrait => ',chatroom.imagePortrait)

    const uploadImage = await this.fileService.uploadFile(file, chatroom.imagePortrait)
    updateChatRoomDto.imagePortrait = uploadImage === null ? chatroom.imagePortrait : uploadImage.Location

    console.log('file => ',file)
    console.log('createChatRoomDto.imagePortrait => ',updateChatRoomDto.imagePortrait)

    return this.chatRoomService.update(term, updateChatRoomDto, user);
  }

  /* The `@Patch(':term/disable')` decorator in the `ChatRoomController` class is defining a PATCH
  endpoint for disabling a chat room based on a specific term. When a PATCH request is made to this
  endpoint with a term parameter in the URL, the `disable` method is called. */
  @Patch(':term/disable')
  async disable(@Param('term') term: string) {
    console.log('term: =>', term)
    return await this.chatRoomService.disable(term);
  }


  /* This code snippet is defining a PATCH endpoint in the `ChatRoomController` class for deleting a chat
  room based on a specific term. When a PATCH request is made to this endpoint with a term parameter
  in the URL, the `delete` method is called. */
  @Patch(':term/delete')
  @Auth(
    validRoles.admin,
    validRoles.superUser
  )
  async delete(@Param('term') term: string) {
    return await this.chatRoomService.delete(term);
  }


  /* The `@Delete(':term')` decorator in the `ChatRoomController` class is defining a DELETE endpoint for
  removing a chat room based on a specific term. When a DELETE request is made to this endpoint with a
  term parameter in the URL, the `remove` method is called. Inside the `remove` method, the `term`
  parameter is used to identify the chat room that needs to be removed, and then the
  `chatRoomService.remove(term)` method is called to perform the removal operation. Additionally, the
  `@Auth` decorator is used to ensure that only users with the roles of admin or superUser are
  authorized to access this endpoint. */
  @Delete(':term')
  @Auth(
    validRoles.admin,
    validRoles.superUser
  )
  remove(@Param('term') term: string) {
    return this.chatRoomService.remove(term);
  }

}
