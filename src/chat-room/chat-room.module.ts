import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';

@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
    AuthModule
  ]
})
export class ChatRoomModule {}
