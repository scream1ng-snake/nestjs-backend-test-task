import { BelongsToMany, Model, Column, DataType, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface ITag {
  creatorUuid: string,
  name: string;
  sortOrde?: number;
}


@Table({tableName: "tags", createdAt: false, updatedAt: false})
export class Tag extends Model<Tag, ITag> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.UUID})
  creatorUuid: string;

  @Column({type: DataType.STRING(40), unique: true})
  name: string;

  @Column({type: DataType.INTEGER, defaultValue: 0})
  sortOrder: number;

  @BelongsTo(() => User)
  creator: User;
}