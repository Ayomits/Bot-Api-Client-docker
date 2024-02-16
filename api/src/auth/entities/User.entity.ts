import { Column, Entity, PrimaryColumn } from 'typeorm';
import { GuildType, TokensType } from '../utils/types';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column({type: "bool"})
  isAdmin: boolean

  @Column({type: 'json'})
  guildsData: GuildType[]

}
