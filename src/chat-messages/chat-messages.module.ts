import { forwardRef, Module } from '@nestjs/common'
import { ChatMessagesService } from './chat-messages.service'
import { ChatMessagesController } from './chat-messages.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from 'src/auth/auth.module'
import { CheckAuthProvider } from 'src/providers/check-auth.provider'
import { ChatMembersModule } from 'src/chat-members/chat-members.module'

@Module({
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService,CheckAuthProvider],
  imports:[
    ConfigModule,
    ChatMembersModule,
    forwardRef(() => AuthModule),
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
