import { Message } from "src/message/entities/message.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Message, message => message.sender)
    sentMessages: Message[];

    @OneToMany(() => Message, message => message.receiver)
    receivedMessages: Message[];
}
