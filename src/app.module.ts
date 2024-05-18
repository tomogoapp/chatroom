import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatMembersModule } from './chat-members/chat-members.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL,{
      dbName:process.env.MONGODB_DB
    }),   
    FilesModule,
    AuthModule,
    ChatRoomModule,
    ChatMembersModule,
    ChatMessagesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
