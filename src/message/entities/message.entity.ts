import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.sentMessages, { eager: true })
    @JoinColumn({name: 'sender_id'})
    sender: User;

    @ManyToOne(() => User, user => user.receivedMessages, {eager: true})
    @JoinColumn({name: 'receiver_id'})
    receiver: User;

    @Column('text')
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    timestamp: Date;
}
