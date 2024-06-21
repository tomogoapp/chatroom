import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateChatMessageDto } from './dto/create-chat-message.dto'
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CheckAuthProvider } from 'src/providers/check-auth.provider'


@Injectable()
export class ChatMessagesService {

  private modelCache: { [key: string]: Model<any> } = {} // this line will be moved to a provider soon
  constructor(
    
    private readonly checkAuthProvider : CheckAuthProvider,

    @InjectModel(ChatMessage.name) 
    private readonly defaultChatModel: Model<ChatMessage>
   
  ){ }

/**
 * This TypeScript function asynchronously posts a chat message after checking user authentication and
 * saving the message to the database.
 * @param {CreateChatMessageDto} createChatMessageDto - The `createChatMessageDto` parameter is an
 * object that contains the data needed to create a new chat message. It likely includes properties
 * such as `roomId`, `content`, `timestamp`, etc. This data is used to create a new chat message in the
 * system.
 * @param userRepository - The `userRepository` parameter seems to represent an object or entity that
 * likely contains information about a user. In the provided code snippet, it is used to access the
 * `id` property of the user.
 * @returns The `postChat` function is returning the saved `message` object after successfully saving
 * the chat message in the database.
 */
  async postMessage(createChatMessageDto: CreateChatMessageDto,userRepository) {

    const { ...chatMessage  } = createChatMessageDto

    const bool = await this.checkAuthProvider.handleCheckAuth(userRepository.id,chatMessage.roomId)

    if(!bool.valueOf()) throw new HttpException('User not validate', HttpStatus.FORBIDDEN)

    const chatMessageModel = this.getModel(chatMessage.roomId.toString());

    const chatmessage = new chatMessageModel({
      ...chatMessage,
      userId: userRepository.id
    })

    try{
      const message = await chatmessage.save()
      return message
    }catch(err){
      this.handleExceptions(err)
    }
  } //✅

/**
 * The function `getChat` retrieves chat messages for a specific room ID using a MongoDB model.
 * @param {string} roomId - The `roomId` parameter is a string that represents the unique identifier of
 * the chat room for which you want to retrieve the chat messages.
 * @returns A Promise that resolves to an array of ChatMessage objects.
 */
  getMessages(roomId:string): Promise<ChatMessage[]> {
    const chatModel = this.getModel(roomId)
    return chatModel.find({roomId}).exec()
  } //✅

  disableMessage(roomId:string){

  }

  private handleExceptions(err: any){
    console.log(err)
    if(err.code === 11000){
      throw new BadRequestException(`Pokemon existe en la DB ${JSON.stringify(err.keyValue)}`)
    }else{
      throw new InternalServerErrorException('No se puede crear Pokemon, revivar logs')
    }
  }//✅

  private getModel(roomId: string): Model<ChatMessage> { // this function will be moved to a provider soon
    const collectionName = `chat_${roomId}`;
    if (!this.modelCache[collectionName]) {
        this.modelCache[collectionName] = this.defaultChatModel.db.model(collectionName, ChatMessageSchema, collectionName);
    }
    return this.modelCache[collectionName];
  }//✅

}
