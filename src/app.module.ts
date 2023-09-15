import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { User } from './user/entities/user.entity';
import { Message } from './message/entities/message.entity';

@Module({
 
  imports: [ ConfigModule.forRoot({envFilePath: [`.env`]}),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [User, Message],
    synchronize: false,
  }),
  UserModule,
  MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
