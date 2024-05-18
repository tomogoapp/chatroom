import { Module } from '@nestjs/common'
import { ChatMessagesService } from './chat-messages.service'
import { ChatMessagesController } from './chat-messages.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity'
import { ConfigModule } from '@nestjs/config'

@Module({
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService],
  imports:[
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema
      }
    ])
  ],
  exports:[
    MongooseModule
  ]
})
export class ChatMessagesModule {}
