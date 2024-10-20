import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, AllowNull } from 'sequelize-typescript';
import { Category } from './category.models';
import { User } from './user.model';
import { File } from './file.models';

@Table({ tableName: 'expenses' })
export class Expense extends Model {
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

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'SET NULL',  // Cascade delete when User is deleted
    onUpdate: 'CASCADE',  // Cascade update when User is updated
  })
  category_id: string;

  @Column({
    type:DataType.STRING,
    allowNull : false,
  })
  name:string;

  @Column({
    type: DataType.ENUM('income', 'expense'),
    allowNull: false,
  })
  transaction_type: 'income' | 'expense';

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({
    type: DataType.ENUM('USD', 'EUR', 'INR', 'GBP', 'JPY'), // Add major default currencies
    allowNull: false,
  })
  currency: 'USD' | 'EUR' | 'INR' | 'GBP' | 'JPY';

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    onDelete: 'CASCADE',  // Cascade delete when User is deleted
    onUpdate: 'CASCADE',  // Cascade update when User is updated
  })
  file_id: string; // Nullable for optional file upload

  // static associate() {
  //   Expense.belongsTo(Category, { foreignKey: 'category_id' });
  // }
}
