import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

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
    message.timestamp = new Date();

    return await this.messageRepository.save(message);
  }

  async findAllMessagesByReceiver(receiver: User): Promise<Message[]> {
    return await this.messageRepository.find({ where: { receiver } });
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { sender: { id: user1Id }, receiver: { id: user2Id } },
        { sender: { id: user2Id }, receiver: { id: user1Id } }
      ],
      order: {
        timestamp: 'ASC'
      }
    });
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

  async getMessageById(id: number): Promise<Message> {
    return await this.messageRepository.findOne({where:{id:id}});
  }

  async getConversation(id: number, partnerId: number): Promise<Message[]> {
    // Récupérez les objets User complets à partir des identifiants fournis.
    const senderUser = await this.userRepository.findOne({where:{id:id}});
    const partnerUser = await this.userRepository.findOne({where:{id:partnerId}});

    // Vérifiez si les utilisateurs existent.
    if (!senderUser || !partnerUser) {
      throw new NotFoundException('One or both users not found');
    }

    // Récupérez les messages entre les deux utilisateurs en utilisant les objets User.
    return await this.messageRepository.find({
      where: [
        { sender: senderUser, receiver: partnerUser },
        { sender: partnerUser, receiver: senderUser }
      ],
      order: { timestamp: 'ASC' },
    });
  }

  async getConversations(userId: number): Promise<User[]> {
    const sentMessages = await this.messageRepository.find({
      where: { sender:{id: userId} },
      relations: ['receiver'] // Joindre les informations du destinataire
    });

    const receivedMessages = await this.messageRepository.find({
      where: { receiver:{id: userId }},
      relations: ['sender'] // Joindre les informations de l'expéditeur
    });

    // Extraire les utilisateurs des messages
    const sentUsers = sentMessages.map(message => message.receiver);
    const receivedUsers = receivedMessages.map(message => message.sender);

    // Fusionner et dédoublonner les listes
    const allUsers = [...new Set([...sentUsers, ...receivedUsers])];

    return allUsers;
  }

  getMessagesAfterId(afterId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { id: MoreThan(afterId) },
      order: { timestamp: 'ASC' },
    });
  }
}
