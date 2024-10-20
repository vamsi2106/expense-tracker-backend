import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey } from 'sequelize-typescript';
import { Expense } from './expenses.models';
import { User } from './user.model';

@Table({ tableName: 'recurring_expenses' })
export class RecurringExpense extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',  // Cascade delete when User is deleted
    onUpdate: 'CASCADE',  // Cascade update when User is updated
  })
  user_id: string;

  @ForeignKey(() => Expense)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',  // Cascade delete when User is deleted
    onUpdate: 'CASCADE',  // Cascade update when User is updated
  })
  expense_id: string;

  @Column({
    type: DataType.ENUM('daily', 'weekly', 'monthly', 'yearly'),
    allowNull: false,
  })
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @Column({ type: DataType.DATE, allowNull: false })
  start_date: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  end_date: Date;
}
