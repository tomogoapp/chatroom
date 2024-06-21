import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param
} from '@nestjs/common'
import { ChatMessagesService } from './chat-messages.service'
import { CreateChatMessageDto } from './dto/create-chat-message.dto'
import { Auth, GetUser } from 'src/auth/decorators'
import { User } from 'src/auth/entities/user.entity'

@Controller('chat')
export class ChatMessagesController {
  constructor(
    private readonly chatMessagesService: ChatMessagesService
  ) { }

  @Post('/post')
  @Auth()
/**
 * The create function asynchronously posts a chat message using the provided data and user
 * information.
 * @param {CreateChatMessageDto} createChatMessageDto - The `createChatMessageDto` parameter is an
 * object that contains the data needed to create a new chat message. It likely includes properties
 * such as the message content, sender information, timestamp, and any other relevant details required
 * for creating a chat message. This object is passed as the request body when making
 * @param {User} user - The `user` parameter in the `create` method is of type `User` and is obtained
 * using the `@GetUser()` decorator. This decorator is likely used to extract the user information from
 * the request context or token. The `user` parameter represents the user who is creating the chat
 * message
 * @returns The `create` method is returning the result of calling the `postMessage` method from the
 * `chatMessagesService` with the `createChatMessageDto` and `user` parameters.
 */
  async create(
    @Body()
    createChatMessageDto:CreateChatMessageDto,
    @GetUser() user: User
  ){
    return await this.chatMessagesService.postMessage(createChatMessageDto,user)
  }

  @Get('/chatroom/:roomid')
  @Auth()
/**
 * This function retrieves chat messages for a specific room ID asynchronously.
 * @param {string} roomid - The `roomid` parameter is a string that represents the identifier of the
 * chat room for which you want to retrieve messages.
 * @returns The `getChat` method is returning the result of calling the `getMessages` method from the
 * `chatMessagesService` with the `roomid` parameter passed to it.
 */
  async getChat(
    @Param('roomid') roomid: string
  ) {
    return await this.chatMessagesService.getMessages(roomid)
  }

  @Patch('/chat/:id')
  @Auth()
/**
 * This TypeScript function disables a chat message based on the provided ID parameter.
 * @param {string} id - The `id` parameter in the `disableMessage` function is a string type parameter
 * that represents the unique identifier of the message that needs to be disabled.
 * @returns The `disableMessage` method from the `chatMessagesService` is being called with the `id`
 * parameter passed to it, and the result of this method call is being returned.
 */
  async disableMessage(
    @Param('id') id: string
  ){
    return await this.chatMessagesService.disableMessage(id)
  }

}
