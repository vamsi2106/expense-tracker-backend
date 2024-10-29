import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Expense } from './expenses.models';

@Table({ tableName: 'expense_tags' })
export class ExpenseTag extends Model {
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

  @BelongsTo(()=>Expense, {foreignKey:'expense_id'})
  expense:Expense

  @Column({ type: DataType.STRING, allowNull: false })
  tag_name: string;
}
