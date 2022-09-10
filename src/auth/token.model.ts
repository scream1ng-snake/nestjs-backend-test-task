import { DataType, ForeignKey, Model } from "sequelize-typescript";
import { Column, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface Itoken {
  uuid: string
  token: string;
}


@Table({tableName: "tokens"})
export class Token extends Model<Token, Itoken> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.UUID})
  uuid: string;

  @Column({type: DataType.STRING(510)})
  token: string;
}