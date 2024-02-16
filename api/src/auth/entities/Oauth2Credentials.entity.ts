import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'oauth2' })
export class Oauth2CredentialsEntity {
  @PrimaryColumn({ name: 'discord_id' })
  userId: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;
}
