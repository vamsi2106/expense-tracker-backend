import { Column, Model, Table, DataType, PrimaryKey, Default, ForeignKey, AllowNull, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';
import { Category } from './category.models';
import { User } from './user.model';
import { File } from './file.models';
import { ExpenseTag } from './expenseTags.models';
import { RecurringTask } from './recurringExpenses.models';

export enum CurrencyTypes {
usd = 'USD',
eur = 'EUR',
inr = 'INR',
gbp = 'GBP',
jpy = 'JPY'
}

export const currencyTypes = ['USD','EUR','INR','GBP','JPY'];
export const transactionTypes = ['income','expense'];

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

  @BelongsTo(()=>User, {foreignKey : 'user_id'})
  user : User

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    onDelete: 'CASCADE',  // Cascade delete when User is deleted
    onUpdate: 'CASCADE',  // Cascade update when User is updated
  })
  category_id: string;

  @BelongsTo(()=>Category, {foreignKey : 'category_id'})
  category : Category

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
    type: DataType.ENUM(...Object.values(CurrencyTypes)), // Add major default currencies
    allowNull: false,
  })
  currency: CurrencyTypes;

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

  @BelongsTo(()=>File, {foreignKey:'file_id'})
  file:File;

  @HasOne(()=>ExpenseTag, {foreignKey: 'expense_id'})
  expense : ExpenseTag
  
  @HasOne(()=>RecurringTask, {foreignKey: 'expense_id'})
  task : RecurringTask
}

