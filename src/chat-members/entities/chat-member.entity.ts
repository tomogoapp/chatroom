import { 
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn
} from "typeorm"
// import { User } from "src/auth/entities/user.entity"
// import { ChatRoom } from "src/chat-room/entities/chat-room.entity"

@Entity()
export class ChatMember {

    @PrimaryGeneratedColumn('uuid')
    id: string

    // @ManyToOne(
    //     () => ChatRoom, 
    //     chatRoom => chatRoom, 
    //     { nullable: true }
    // )
    // @JoinColumn({ 
    //     name: 'roomId' 
    // })
    // room: ChatRoom

    @Column({ type: 'uuid' })
    roomId: string;  // Directamente almacenar el ID de la sala de chat

    // @ManyToOne(
    //     () => User, 
    //     user => user, 
    //     { nullable: true }
    // )
    // @JoinColumn({
    //     name: 'ChatMember' 
    // })
    // member: User

    @Column({ type: 'uuid' })
    memberId: string;  // Directamente almacenar el ID de la sala de chat


    @Column('timestamp',{
        nullable: true
    })
    joinedAt: Date

    @Column('bool',{
        default: false
    })
    isDeleted: boolean

    @UpdateDateColumn({ type: 'timestamptz' })
    updateAt: Date

}
