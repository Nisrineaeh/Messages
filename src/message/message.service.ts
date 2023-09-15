import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {

  constructor(@InjectRepository(Message) private messageRepository: Repository<Message>,
              @InjectRepository(User) private userRepository: Repository<User>){}

  // create(createMessageDto: CreateMessageDto) {
  //   return 'This action adds a new message';
  // }

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const sender = await this.userRepository.findOne({where:{id:createMessageDto.senderId}});
    const receiver = await this.userRepository.findOne({where:{id:createMessageDto.receiverId}});

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or Receiver not found');
    }

    const message = new Message();
    message.sender = sender;
    message.receiver = receiver;
    message.content = createMessageDto.content;

    return await this.messageRepository.save(message);
  }

  async findAllMessagesByReceiver(receiver: User): Promise<Message[]> {
    return await this.messageRepository.find({ where: { receiver } });
  }


  // findAll() {
  //   return `This action returns all message`;
  // }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
