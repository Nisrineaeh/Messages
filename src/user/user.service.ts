import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }


  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException(`L'utilisateur ID n° ${id} n'existe pas !`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise < User > {
      const userToUpDate = await this.findOne(id);
      Object.assign(userToUpDate, updateUserDto);
      return await this.userRepository.save(userToUpDate);
    }


  async remove(id: any): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'a pas été trouvé.`);
      }
      await this.userRepository.remove(user);
      console.log('Utilisateur supprimé avec succès :', user);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression de l\'utilisateur.');
    }
  }

  async verifierConnexion(username: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { username: username } });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      return match;
    }
    return false;
  }
}
