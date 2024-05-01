
import { slug } from "slug-gen"
import { 
    BeforeInsert, 
    Column, 
    Entity, 
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

    @BeforeInsert()
    lowerCaseBeforeInsert(){
        this.chatroom_name = this.chatroom_name.toLocaleLowerCase().trim()
    }

    @BeforeInsert()
    slugBeforeInsert(){
        this.slug = slug(this.slug)
    }
}
