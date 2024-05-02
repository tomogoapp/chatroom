
import { slug } from "slug-gen"
import { User } from "src/auth/entities/user.entity";
import { 
    BeforeInsert, 
    Column, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class ChatRoom {

    @PrimaryGeneratedColumn()
    id:string

    @Column()
    chatroom_name: string

    @Column()
    slug: string

    @Column()
    image_portrait: string

    @Column()
    created_at: string

    @Column()
    created_by: string

    @Column()
    delete_at: string

    @Column()
    is_delete: boolean

    @ManyToOne(
        () => User,
        ( user ) => user.id,
        {
            eager:true
        }
    )
    userId:User

    @BeforeInsert()
    lowerCaseBeforeInsert(){
        this.chatroom_name = this.chatroom_name.toLocaleLowerCase().trim()
    }

    @BeforeInsert()
    slugBeforeInsert(){
        this.slug = slug(this.slug)
    }
}
