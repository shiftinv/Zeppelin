import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("username_history")
export class UsernameHistoryEntry {
  @Column()
  @PrimaryColumn()
  id: string;

  @Column() user_id: string;

  @Column() username: string;

  @Column({ type: String, nullable: true }) global_name: string | null;

  @Column() timestamp: string;
}
