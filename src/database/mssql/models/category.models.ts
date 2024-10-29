import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { Expense } from './expenses.models';

@Table({ tableName: 'categories' })
export class Category extends Model {
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
  }) // Nullable for default categories
  user_id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({
    type: DataType.ENUM('income', 'expense'),
    allowNull: false,
  })
  type: 'income' | 'expense';

  @Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: false })
  default_category: boolean; // True for admin-defined, False for user-defined

  @HasMany(() => Expense, { foreignKey: "category_id" })
  expense: Expense[];
}