import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { File } from './file.model';
import { User } from './user.model';

@Table({ tableName: 'expenses' })
export class Expense extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4) // Automatically generates a UUID (version 4)
  @Column({ type: DataType.UUID })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({
    allowNull: false,
  })
  category: string;

  @ForeignKey(() => File)
  @Column({ type: DataType.UUID, allowNull: true }) // file_id is nullable
  file_id: string;
}
