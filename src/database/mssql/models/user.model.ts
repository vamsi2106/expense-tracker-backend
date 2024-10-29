import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { Role } from 'src/core/enums/roles.enum';
import { Expense } from './expenses.models';

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
    allowNull: true,
  })
  userImageUrl: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    // enum: Role,
    defaultValue: Role.user,
  })
  role: Role;

  @HasMany(()=>Expense, {foreignKey : 'user_id'})
  expense : Expense[];
}
