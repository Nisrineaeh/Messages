import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(createAuthDto: CreateAuthDto) {
    const { username, password } = createAuthDto;

    // hashage du mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // création d'une entité user
    const user = this.userRepository.create({
      username: username,
      password: hashedPassword,
    });

    try {
      // enregistrement de l'entité user
      const createdUser = await this.userRepository.save(user);
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      // gestion des erreurs
      if (error.code === '23505') {
        throw new ConflictException('username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(loginDto: LoginDto) { 
    const { username, password } = loginDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id , user_id: user.id};
      const accessToken = this.jwtService.sign(payload);
      return { accessToken , user_id: user.id};
    } else {
      throw new UnauthorizedException(
        'Ces identifiants ne sont pas bons, déso...',
      );
    }
  }
}
