import { BelongsToMany, HasMany, HasOne, Model } from "sequelize-typescript";
import { Column, DataType, Table } from "sequelize-typescript";
import { Token } from "src/auth/token.model";
import { Tag } from "src/tags/tags.model";

interface IUser {
  email: string;
  nickname: string;
  password: string;
}


@Table({tableName: "users", createdAt: false, updatedAt: false})
export class User extends Model<User, IUser> {
  @Column({type: DataType.UUID, unique: true, primaryKey: true, defaultValue: DataType.UUIDV4 })
  uuid: string;

  @Column({type: DataType.STRING(100), allowNull: false})
  email: string;

  @Column({type: DataType.STRING(100), allowNull: false})
  password: string;

  @Column({type: DataType.STRING(30), allowNull: false})
  nickname: string;

  @HasOne(() => Tag)
  createdTag: Tag

  @HasOne(() => Token)
  tokens: Token;
}