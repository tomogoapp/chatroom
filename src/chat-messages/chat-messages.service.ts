import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateChatMessageDto } from './dto/create-chat-message.dto'
import { UpdateChatMessageDto } from './dto/update-chat-message.dto'
import { ChatMessage } from './entities/chat-message.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CheckAuthProvider } from 'src/providers/check-auth.provider'


@Injectable()
export class ChatMessagesService {

  constructor(
    
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel : Model<ChatMessage>,

    private readonly checkAuthProvider : CheckAuthProvider

  ){

  }


/**
 * This TypeScript function creates a chat message after checking user authentication and handling
 * exceptions.
 * @param {CreateChatMessageDto} createChatMessageDto - The `createChatMessageDto` parameter is an
 * object that contains the data needed to create a new chat message. It likely includes properties
 * such as `roomId`, `content`, `timestamp`, etc. This object is used to create a new chat message in
 * the system.
 * @param userRepository - The `userRepository` parameter seems to represent the user repository or
 * service used to interact with user data in the application. It is likely used to retrieve
 * information about the current user making the chat message creation request.
 * @returns The `create` method is returning the `message` object that is saved after creating a new
 * chat message in the database.
 */
  async create(createChatMessageDto: CreateChatMessageDto,userRepository) {

    const { ...chatMessage  } = createChatMessageDto

    const bool = await this.checkAuthProvider.handleCheckAuth(userRepository.id,chatMessage.roomId)

    if(!bool.valueOf()){
      throw new HttpException('Usuario no validado', HttpStatus.FORBIDDEN)
    }

    const chatmessage = new this.chatMessageModel({
      ...chatMessage,
      userId:userRepository.id
    })

    try{
      const message = await chatmessage.save()
      return message
    }catch(err){
      this.handleExceptions(err)
    }
  } //🟩

  findChat(id:string) {
    return `This action returns all message`
  }

  findAll() {
    return `This action returns all chatMessages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatMessage`;
  }

  update(id: number, updateChatMessageDto: UpdateChatMessageDto) {
    return `This action updates a #${id} chatMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatMessage`;
  }

  private handleExceptions(err: any){
    if(err.code === 11000){
      throw new BadRequestException(`Pokemon existe en la DB ${JSON.stringify(err.keyValue)}`)
    }else{
      throw new InternalServerErrorException('No se puede crear Pokemon, revivar logs')
    }
  } //🟩

}
