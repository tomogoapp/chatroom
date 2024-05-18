
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'


@Schema()
export class ChatMessage extends Document {
    @Prop({ type: Types.ObjectId,  required: true })
    roomId: Types.ObjectId

    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId

    @Prop({ required: true })
    messageText: string

    @Prop({ required: false })
    filePath: string

    @Prop({ required: false })
    fileType: string

    @Prop({ default: Date.now })
    timestamp: Date

    @Prop({ default: false })
    isDeleted: boolean

    @Prop({ default: true })
    isAvailable: boolean
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage)
