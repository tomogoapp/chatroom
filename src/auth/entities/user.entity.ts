import { 
    BeforeInsert, 
    BeforeUpdate, 
    Column, 
    CreateDateColumn, 
    Entity,
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm"
import { ChatMember } from "src/chat-members/entities/chat-member.entity"

/* The above class defines a User entity with various properties such as id, email, backupEmail,
password, username, isActive, roles, and includes before insert and update hooks to convert email to
lowercase. */
@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text',{
        unique:true
    })
    email: string

    @Column('text',{
        nullable: true
    })
    backupEmail: string

    @Column('text',{
        select: false
    })
    password: string

    @Column('text',{
        unique: true, 
        nullable: false
    })
    username: string

    @Column('text',{
        nullable: true
    })
    displayName: string

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[]

    @Column('text',{
        nullable: true
    })
    avatar: string

    @Column('bool',{
        default: true
    })
    isActive: boolean

    @Column('bool',{
        default: false
    })
    isDeleted: boolean

    @UpdateDateColumn()
    updateAt: Date

    @CreateDateColumn()
    createAt: Date

    // @OneToMany(
    //     () => Product,
    //     ( product ) => product.user
    // )
    // product: Product

    // @OneToMany(
    //     () => ChatMember,
    //     (chatmember) => chatmember,
    //     {
    //         eager:true
    //     }
    // )
    // member: ChatMember

    @BeforeInsert()
    lowerCaseBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeInsert()
    toCreateDisplayName(){
        if(this.displayName === undefined ){
            this.displayName = this.username.toLocaleLowerCase().trim()
        }
        console.log('this.displayName => ',this.displayName)
    }

    @BeforeUpdate()
    lowerCaseBeforeUpdate(){
        this.lowerCaseBeforeInsert()
    }

}
