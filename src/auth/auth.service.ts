import { 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common'
import { 
  CreateUserDto,
  LoginUserDto 
} from './dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ErrorRequestProvider } from 'src/providers/error-request.provider'
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interface/jwt-payload'
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly errorRequestProvider: ErrorRequestProvider,

    private readonly jwtService: JwtService

  ){}

/**
 * The function creates a new user, hashes the password, saves the user to the database, and returns a
 * success message along with the user object and a JWT token.
 * @param {CreateUserDto} createUserDto - The `createUserDto` parameter in the `create` method likely
 * represents a data transfer object (DTO) containing information needed to create a new user. It may
 * include properties such as `username`, `email`, `password`, and any other relevant user details.
 * @returns The `create` method is returning an object with the following properties:
 * - "message": "User create successfully"
 * - user: the newly created user object
 * - token: a JWT token generated using the user's email address
 */
  async create(createUserDto: CreateUserDto) {
    
    try{

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password,10 )
      })

      await this.userRepository.save(user)

      return {
        "message":"User create successfully",
        ...user,
        token:this.getJwtToken({
          id: user.id,
          email: user.email,
          username: user.fullName,
          is_active: user.isActive,
          roles: user.roles
        })
      }
      
    }catch(error){
      this.errorRequestProvider.handleDBException(error)
    }

  }

/**
 * This function performs user login authentication by checking the provided email and password against
 * the stored user credentials and generating a JWT token upon successful authentication.
 * @param {LoginUserDto} loginUserDto - The `loginUserDto` parameter in the `login` function is an
 * object that contains the user's email and password. It is used to authenticate and log in a user by
 * checking the provided email and password against the stored user data in the database.
 * @returns The `login` function is returning an object with three properties:
 * 1. A "message" property with a welcome message that includes the user's full name.
 * 2. A "user" property containing the user object retrieved from the database.
 * 3. A "token" property containing a JWT token generated using the user's email address.
 */
  async login( loginUserDto:LoginUserDto ){

    const { email,password } = loginUserDto

    const user = await this.userRepository.findOne({
      where: {email},
      select:{
        email: true,
        fullName:true,
        password: true,
        id: true,
        roles:true,
        isActive: true
      }
    })

    if( !user ){
      throw new UnauthorizedException('User dont found')
    }

    if( !bcrypt.compareSync(password, user.password) ){
      throw new UnauthorizedException('Password doesnt match')
    }



    return {
      user:{
        fullName: user.fullName,
        id: user.id,
        roles:user.roles,
        is_active:user.isActive,
      },
      token:this.getJwtToken({
        id: user.id,
        email: user.email,
        username: user.fullName,
        is_active: user.isActive,
        roles:user.roles
      })
    }

  }

/**
 * The function `getJwtToken` generates a JWT token by signing the provided payload using the
 * `jwtService`.
 * @param {JwtPayload} payload - The `payload` parameter in the `getJwtToken` function is of type
 * `JwtPayload`, which likely contains the data that will be used to generate the JWT token. This data
 * could include information such as the user's ID, role, and any other relevant details needed for
 * authentication and authorization.
 * @returns The function `getJwtToken` is returning a JWT token that is generated by signing the
 * provided `payload` using the `jwtService`.
 */
  private getJwtToken( payload: JwtPayload ){

    return this.jwtService.sign(payload)

  }

  async checkAuthStatus(user:User){
    return{
      ...user,
      token:this.getJwtToken({
        id: user.id,
        email: user.email,
        username: user.fullName,
        is_active: user.isActive,
        roles:user.roles
      })
    }
  }

}