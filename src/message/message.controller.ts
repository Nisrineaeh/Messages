import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @Post()
  // create(@Body() createMessageDto: CreateMessageDto) {
  //   return this.messageService.create(createMessageDto);
  // }
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createMessage(@Body() createMessageDto: CreateMessageDto): Promise<Message>  {
    return this.messageService.createMessage(createMessageDto);
  }

  // @Get(':receiverId')
  // getMessagesForReceiver(@Param('receiverId') receiverId: number) {
  //   const receiver = new User();
  //   receiver.id = receiverId;
  //   return this.messageService.findAllMessagesByReceiver(receiver);
  // }

  @Get('between/:user1Id/:user2Id')
  getMessagesBetweenUsers(@Param('user1Id') user1Id: number, @Param('user2Id') user2Id: number) {
    return this.messageService.getMessagesBetweenUsers(user1Id, user2Id);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/conversations')
  async getConversations(@Req() request) {
    const userId = request.user.id;
    return await this.messageService.getConversations(userId);
  }


  @Get('new/:afterId')
  getNewMessage(@Param('afterId') afterId:number){
    return this.messageService.getMessagesAfterId(afterId);
  }
  // @Get()
  // findAll() {
  //   return this.messageService.findAll();
  // }

  @Get('/:id')
  async getMessageById(@Param('id') id: number) {
    return await this.messageService.findOne(id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('/conversation/:partnerId')
  async getConversation(@Req() request, @Param('partnerId') partnerId: number) {
    const userId = request.user.id;
    return await this.messageService.getConversation(userId, partnerId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.messageService.remove(id);
  }
}
