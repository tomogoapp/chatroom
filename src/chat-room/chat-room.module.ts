import { forwardRef, Module } from '@nestjs/common'
import { ChatRoomService } from './chat-room.service'
import { ChatRoomController } from './chat-room.controller'
import { AuthModule } from 'src/auth/auth.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatRoom } from './entities/chat-room.entity'
import { ErrorRequestProvider } from 'src/providers/error-request.provider'
import { FilesModule } from 'src/files/files.module'
import { ChatMembersModule } from 'src/chat-members/chat-members.module'

@Module({
  controllers: [ChatRoomController],
  providers: [
    ChatRoomService,
    ErrorRequestProvider,
    { 
      provide: 'ServiceName', 
      useValue: 'ErrorRequestProvider' 
    }
  ],
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
    FilesModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ChatMembersModule)
  ],
  exports:[
    ChatRoomService,
    TypeOrmModule.forFeature([ChatRoom])
  ]
})
export class ChatRoomModule {}
