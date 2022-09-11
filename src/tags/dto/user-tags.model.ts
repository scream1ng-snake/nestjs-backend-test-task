import { BelongsToMany, Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Tag } from "../tags.model";

@Table({tableName: "user-tags", createdAt: false, updatedAt: false})
export class UserTags extends Model {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.UUID})
  uuid: string;

  @ForeignKey(() => Tag)
  @Column({type: DataType.STRING})
  tagId: number;

  @BelongsTo(() => Tag)
  tags: Tag;

  @BelongsTo(() => User)
  users: User
}