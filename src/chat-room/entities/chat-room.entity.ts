
import { 
    BeforeInsert, 
    Column, 
    CreateDateColumn, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn
} from "typeorm"
import { slug } from "slug-gen"
import { User } from "src/auth/entities/user.entity"
import { ChatMember } from "src/chat-members/entities/chat-member.entity"

@Entity()
export class ChatRoom {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    chatroomName: string

    @Column()
    slug: string

    @Column({
        nullable: true
    })
    imagePortrait: string


    @Column('bool',{
        default: true
    })
    isActive: boolean

    @Column('bool',{
        default: false
    })
    isDeleted: boolean

    @ManyToOne(
        () => User,
        ( user ) => user.id,
        {
            eager:true
        }
    )
    createdBy: User

    // @OneToMany(
    //     () => ChatMember,
    //     (chatMember) => chatMember.room,
    //     {
    //         eager:true
    //     }
    // )
    // members: ChatMember[]


    @UpdateDateColumn()
    updateAt: Date

    @CreateDateColumn()
    createAt: Date

    @BeforeInsert()
    slugBeforeInsert(){
        this.slug = slug(this.chatroomName)
    }
}
