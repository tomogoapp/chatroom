import { Module } from "@nestjs/common"
import { CommonService } from "./common.service"
import { ChatMembersModule } from "src/chat-members/chat-members.module"

@Module({
    providers:[CommonService],
    exports:[CommonModule],
    imports:[ChatMembersModule]
})
export class CommonModule {}