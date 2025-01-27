import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { UrlTopics } from "../utils/Type";

@Entity("urls")
export class ShortUrls {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "varchar", length: 255, unique: true })
  alias!: string;

  @Column({ type: "varchar", length: 255 })
  longUrl!: string;

  @Column({ type: "enum", enum: UrlTopics })
  topic!: UrlTopics;

  @Column({ type: "int", default: 0 })
  totalClick!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
