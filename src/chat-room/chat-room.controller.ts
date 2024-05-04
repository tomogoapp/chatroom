
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
  Query
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

@Controller('chat-room')
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private fileService: FilesService
  ) {}

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

    const uploadAvatar = await this.fileService.uploadFile(file)
    createChatRoomDto.imagePortrait = uploadAvatar === null ? null : uploadAvatar.Location
    
    return this.chatRoomService.create(createChatRoomDto, user);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDTO
  ) {
    return this.chatRoomService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    return await this.chatRoomService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatRoomService.update(+id, updateChatRoomDto);
  }

/* The `@Patch(':term/disable')` decorator in the `ChatRoomController` class is defining a PATCH
endpoint for disabling a chat room based on a specific term. When a PATCH request is made to this
endpoint with a term parameter in the URL, the `disable` method is called. */
  @Patch(':term/disable')
  async disable(@Param('term') term: string){
    console.log('term: =>', term)
    return await this.chatRoomService.disable(term);
  }

  @Patch(':term/delete')
  async delete(@Param('term') term: string){
    return await this.chatRoomService.delete(term);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.chatRoomService.remove(term);
  }

}
