
import { slug } from "slug-gen"
import { User } from "src/auth/entities/user.entity";
import { 
    BeforeInsert, 
    Column, 
    CreateDateColumn, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn
} from "typeorm";

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

    // @Column()
    // createdBy: string

    @UpdateDateColumn()
    updateAt: Date

    @CreateDateColumn()
    createAt: Date

    @BeforeInsert()
    slugBeforeInsert(){
        this.slug = slug(this.chatroomName)
    }
}
