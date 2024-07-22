import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("nickname_history")
export class NicknameHistoryEntry {
  @Column()
  @PrimaryColumn()
  id: string;

  @Column() guild_id: string;

  @Column() user_id: string;

  @Column({ type: String, nullable: true }) nickname: string | null;

  @Column() timestamp: string;
}
