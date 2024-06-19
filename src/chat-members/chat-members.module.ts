import { forwardRef, Module } from '@nestjs/common';
import { ChatMembersService } from './chat-members.service';
import { ChatMembersController } from './chat-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMember } from './entities/chat-member.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { CheckAuthProvider } from 'src/providers/check-auth.provider';

@Module({
  controllers: [ChatMembersController],
  providers: [ChatMembersService,CheckAuthProvider],
  imports: [
    TypeOrmModule.forFeature([ChatMember]), // Asegúrate de que esto está aquí
    forwardRef(() =>ChatRoomModule), // Uso de forwardRef aquí también
    forwardRef(() => AuthModule)
  ],
  exports:[
    TypeOrmModule.forFeature([ChatMember]),
    ChatMembersModule
  ]
})
export class ChatMembersModule {}
