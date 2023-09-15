import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/user/entities/user.entity';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @Post()
  // create(@Body() createMessageDto: CreateMessageDto) {
  //   return this.messageService.create(createMessageDto);
  // }

  @Post()
  createMessage(@Body() createMessageDto: CreateMessageDto): Promise<Message>  {
    return this.messageService.createMessage(createMessageDto);
  }

  @Get(':receiverId')
  getMessagesForReceiver(@Param('receiverId') receiverId: number) {
    const receiver = new User();
    receiver.id = receiverId;
    return this.messageService.findAllMessagesByReceiver(receiver);
  }

  // @Get()
  // findAll() {
  //   return this.messageService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
