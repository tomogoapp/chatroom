import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateChatRoomDto } from './dto/create-chat-room.dto'
import { UpdateChatRoomDto } from './dto/update-chat-room.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ChatRoom } from './entities/chat-room.entity'
import { Repository } from 'typeorm'
import { User } from 'src/auth/entities/user.entity'
import { ErrorRequestProvider } from 'src/providers/error-request.provider'
import { PaginationDTO } from 'src/common/dto/pagination.dto'
import { isUUID } from 'class-validator'
// import { FilesService } from 'src/files/files.service'

/* The `ChatRoomService` class in TypeScript provides methods for creating, finding, updating,
disabling, deleting, and removing chat rooms with error handling and pagination support. */
@Injectable()
export class ChatRoomService {

  constructor(

    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly errorRequestProvider: ErrorRequestProvider,

    // private fileService: FilesService
  ){}

/**
 * This TypeScript function creates a chat room using data from a DTO and a user repository.
 * @param {CreateChatRoomDto} createChatRoomDto - The `createChatRoomDto` parameter is an object that
 * contains the data needed to create a new chat room. It likely includes properties such as the name
 * of the chat room, the description, and any other relevant information required for creating a chat
 * room.
 * @param userRepository - The `userRepository` parameter is likely an object or class instance that
 * represents a repository for managing user data, such as fetching user details or performing
 * operations related to users in the database. In the provided code snippet, it seems to be used to
 * access the `id` property of the user who created the
 * @returns The `create` method is returning the created `chatroom` object.
 */
  async create(createChatRoomDto: CreateChatRoomDto,userRepository) {

    try{

      const { ...chatRoom } = createChatRoomDto

      const chatroom = this.chatRoomRepository.create({
        ...chatRoom,
        createdBy:userRepository.id
      })

      await this.chatRoomRepository.save(chatroom)

      return chatroom

    }catch(error){
      this.errorRequestProvider.handleDBException(error)
    }
   
  }

/**
 * The `findAll` function retrieves chatrooms with pagination based on the provided `PaginationDTO`.
 * @param {PaginationDTO} paginationDto - The `paginationDto` parameter is an object that contains
 * information about pagination, such as the `limit` and `offset` values. In the `findAll` method, the
 * `paginationDto` object is destructured to extract the `limit` and `offset` values, with default
 * values of
 * @returns The `findAll` method is returning a list of chatrooms based on the pagination parameters
 * provided in the `paginationDto`. The method uses the `skip` and `take` options from TypeORM's `find`
 * method to implement pagination by skipping a specified number of records (offset) and limiting the
 * number of records returned (limit). The method then returns the chatrooms fetched based on the
 * pagination criteria
 */
  async findAll(paginationDto: PaginationDTO) {
    
    const { limit = 2, offset = 0 } = paginationDto

    const chatrooms = await this.chatRoomRepository.find(
      {
        skip: offset,
        take: limit
      }
    )

    return chatrooms

  }

  async showMain(){
    const chatrooms = await this.chatRoomRepository.find({take:9})
    return chatrooms
  }


 /**
  * This TypeScript function searches for a chatroom by either its ID or slug and returns it if found,
  * throwing an error if not.
  * @param {string} term - The `term` parameter in the `findOne` function is a string that represents
  * either the `id` or `slug` of a chatroom. The function first checks if the `term` is a valid UUID.
  * If it is a UUID, it searches for a chatroom by `id`,
  * @returns The `findOne` method is returning a `ChatRoom` object that matches the search condition
  * provided. If a chatroom is not found based on the search condition, a `BadRequestException` with
  * the message 'Chatroom no encontrado' is thrown.
  */
  async findOne(term: string) {
    let chatroom: ChatRoom

    const searchCondition = isUUID(term) ? { id:term } : { slug: term }
    chatroom = await this.chatRoomRepository.findOneBy(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    return chatroom;
  }

/**
 * This TypeScript function updates a chat room based on a search term and provided data.
 * @param {string} term - The `term` parameter in the `update` function is a string that represents
 * either the `id` or `slug` of a chat room. The function updates the chat room based on this term and
 * the provided `updateChatRoomDto` object. If the term is a valid UUID, it
 * @param {UpdateChatRoomDto} updateChatRoomDto - The `updateChatRoomDto` parameter is an object
 * containing the data that needs to be updated for a chat room. It likely includes properties such as
 * name, description, visibility, etc. The function takes this object and updates the corresponding
 * chat room entity in the database with the new values provided in the
 * @returns The `update` function is returning the updated `ChatRoom` object after applying the changes
 * specified in the `updateChatRoomDto` object.
 */
  async update(term: string, updateChatRoomDto: UpdateChatRoomDto) {
    let chatroom: ChatRoom
    const { ...toUpdate } = updateChatRoomDto
    const searchCondition = isUUID(term) ? { id:term } : { slug: term }
    chatroom = await this.chatRoomRepository.preload(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    console.log('updateChatRoomDto => ',updateChatRoomDto)
    
    Object.assign(chatroom, toUpdate);
    return this.chatRoomRepository.save(chatroom);

  }

/**
 * The `disable` function in TypeScript asynchronously disables a chatroom based on a provided term
 * (either ID or slug) and returns a message indicating the chatroom is no longer available.
 * @param {string} term - The `term` parameter in the `disable` function is a string that represents
 * either the id or the slug of a chatroom. The function first checks if the `term` is a UUID, and
 * based on that, it searches for the chatroom using either the id or the slug. If
 * @returns `Esta sala de chat ya no esta disponible`
 */
  async disable(term: string){
    let chatroom: ChatRoom
    const searchCondition = isUUID(term) ? { id:term } : { slug: term }

    chatroom = await this.chatRoomRepository.findOneBy(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    chatroom.isActive = false

    this.chatRoomRepository.save(chatroom)

    return `Esta sala de chat ya no esta disponible`
  }

/**
 * The `delete` function in TypeScript deletes a chatroom based on a given term (either ID or slug) and
 * marks it as deleted.
 * @param {string} term - The `term` parameter in the `delete` function is a string that represents
 * either the ID or the slug of a chatroom that needs to be deleted. The function first checks if the
 * `term` is a valid UUID. If it is a UUID, it searches for the chatroom by its
 * @returns `Esta sala de chat ha sido borrada`
 */
  async delete( term: string ){
    let chatroom: ChatRoom
    const searchCondition = isUUID(term) ? { id:term } : { slug: term }

    chatroom = await this.chatRoomRepository.findOneBy(searchCondition)

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    chatroom.isDeleted = true

    this.chatRoomRepository.save(chatroom)

    return `Esta sala de chat ha sido borrada`
  }

/**
 * This TypeScript function removes a chatroom from the server based on a given term (either ID or
 * slug).
 * @param {string} term - The `term` parameter in the `remove` function is a string that represents
 * either the `id` or `slug` of a chatroom. The function first checks if the `term` is a valid UUID. If
 * it is a UUID, it searches for a chatroom with that `id
 * @returns `Esta sala de chat ha sido removida del servidor`
 */
  async remove(term: string) {
    let chatroom: ChatRoom
    const searchCondition = isUUID(term) ? { id:term } : { slug: term }
    chatroom = await this.chatRoomRepository.findOne({where:searchCondition})

    if(!chatroom){
      throw new BadRequestException('Chatroom no encontrado')
    }

    await this.chatRoomRepository.remove(chatroom)

    return `Esta sala de chat ha sido removida del servidor`

  }
}
