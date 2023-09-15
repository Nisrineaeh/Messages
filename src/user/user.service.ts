import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>){}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password , ...rest } = createUserDto;

      // Hachage du mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      // Création de l'utilisateur avec le mot de passe haché
      const nouvelUtilisateur = this.userRepository.create({
        ...rest,
        password: hashedPassword,
      });

      return this.userRepository.save(nouvelUtilisateur);
    } catch (err) {
      if (err.code === '23505') {
        throw new HttpException('L\'email ou le nom d\'utilisateur existe déjà', HttpStatus.BAD_REQUEST);
      } else {
        console.error("Erreur lors de la création de l'utilisateur:", err);
        throw new InternalServerErrorException('Erreur lors de la création de l\'utilisateur');
      }
    }
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({where:{id:id}});
  }


  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
