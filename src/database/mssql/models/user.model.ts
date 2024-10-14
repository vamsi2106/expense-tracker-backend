import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';

import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: uuidv4,
    allowNull: false,
    primaryKey: true,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user',
  })
  role: 'admin' | 'user';
}
