import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ShortUrls } from "./Url";
import { User } from "./User";

@Entity("analytics")
@Index("shortUrlUserIndex", ["shortUrlId", "userId"]) // composite index 
export class Analytics {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => ShortUrls, { onDelete: "CASCADE" })
  @JoinColumn({ name: "shortUrlId" })
  shortUrlId!: ShortUrls; 

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId!: User;

  @Column({ type: "varchar", length: 255 })
  device!: string;

  @Column({ type: "varchar", length: 255 })
  os!: string;

  @Column({ type: "varchar", length: 255 })
  userAgent!: string;

  @Column({ type: "varchar", length: 255 })
  ipAddress!:string;

 @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 timestamp!: Date;

}
